import { Payment } from '@a2seven/yoo-checkout';
import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DB, schema } from 'db';
import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { premiumPlans } from 'shared/helpers/premiumPlans';
import {
  releaseMetadataSchema,
  subscriptionMetadataSchema,
} from 'shared/schema/order.schema';
import { Primitive } from 'typia';
import { TSelectUserSchema } from '../../../../packages/shared/lib/schema/user.schema';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { SessionService } from '../auth/session.service';
import { checkout, currency } from '../shared/checkout';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { FinanceService } from './finance.service';

export type TCreateOrderResponse = {
  redirect_url: string;
};

export type TCreateOrderBody =
  | {
      type: 'subscription';
      subscriptionLevel: keyof typeof premiumPlans;
    }
  | {
      type: 'release';
      releaseId: string;
    };

export type TMakeOrderResponse = {
  confirmation_url: string;
};

export type TPayoutTicketData = InferSelectModel<typeof schema.payouts>;

export type TGetPayoutTicketsResponse = {
  data: TPayoutTicketData[];
};

export type TGetPayoutTicketsQuery = TPageQuery & {
  confirmed?: boolean;
};

export type TGetPayoutTicketResponse = {
  data: TPayoutTicketData;
};

export type TCreatePayoutTicketBody = {
  data: Primitive<
    Pick<
      InferInsertModel<typeof schema.payouts>,
      'recieverName' | 'amount' | 'accountNumber'
    >
  >;
};

export type TUpdatePayoutTicketStatusBody = {
  data: Pick<Primitive<TPayoutTicketData>, 'confirmed'>;
};

export type TReceiptItems = Payment['receipt']['items'];

export type TGetSubscriptionEstimateResponse = {
  data: TReceiptItems;
};

export type TGetReleaseEstimateResponse = {
  data: TReceiptItems;
};

@ApiTags('finance')
@Controller('finance')
export class FinanceController {
  logger = new Logger(FinanceController.name);

  constructor(
    private readonly sessionService: SessionService,
    @Inject('DB_TAG') private readonly db: DB,
    private readonly financeService: FinanceService,
  ) {}

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Post()
  async createOrder(
    @TypedBody() body: TCreateOrderBody,
    @Session() token: string,
  ): Promise<TMakeOrderResponse> {
    const { user } = await this.sessionService.validateSession(token);

    if (!user) {
      throw new UnauthorizedException();
    }

    let returnPath = '/dashboard';

    let orderMetadata: Omit<TCreateOrderBody, 'type'> = {};

    let receiptItems: Payment['receipt']['items'] = [];

    let paymentDescription = '';

    // если оформляем релиз

    if (body.type === 'release') {
      const release = await this.db.query.release.findFirst({
        where: and(
          eq(schema.release.id, body.releaseId),
          eq(schema.release.authorId, user.id),
        ),
      });

      if (!release) {
        throw new BadRequestException('Нет такого релиза');
      }

      paymentDescription = `Оплата дистрибуции релиза ${release.id}`;

      orderMetadata = { releaseId: body.releaseId };

      receiptItems = [];

      receiptItems = await this.financeService.calculateReleaseEstimate(
        body.releaseId,
        user.isSubscribed && !!user.subscriptionLevel
          ? user.subscriptionLevel
          : 'none',
      );
    }

    // если оформляем подписку

    if (body.type === 'subscription') {
      paymentDescription = `Оплата подписки уровня "${
        premiumPlans[body.subscriptionLevel].name
      }"`;

      returnPath = '/dashboard/news';

      orderMetadata = { subscriptionLevel: body.subscriptionLevel };

      receiptItems = this.financeService.calculateSubscriptionEstimate(
        body.subscriptionLevel,
      );
    }

    // суммируем чек

    const receiptSumma = receiptItems.reduce((res, item) => {
      return res + Number(item.amount.value);
    }, 0);

    if (receiptSumma < 1) {
      throw new InternalServerErrorException('Что-то пошло не так');
    }

    // read https://yookassa.ru/developers/api?codeLang=bash#create_payment

    const headers = new Headers();

    headers.append('Content-Type', 'application/json');

    headers.append(
      'Authorization',
      `Basic ${btoa(`${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`)}`,
    );

    headers.append('Idempotence-Key', `${Date.now()}`);

    const payment = await checkout
      .createPayment({
        amount: {
          value: receiptSumma.toFixed(2),
          currency,
        },
        payment_method_data: {
          type: 'bank_card',
        },
        confirmation: {
          type: 'redirect',
          return_url: `${process.env.NEXT_PUBLIC_DOMAIN}${returnPath}`,
        },
        description: paymentDescription,
        receipt: {
          items: receiptItems,
          tax_system_code: 1,
          customer: {
            email: user.email,
          },
        },
      })
      .catch((e) => {
        console.log(e);
        return null;
      });

    if (!payment) {
      throw new InternalServerErrorException(
        'Что-то пошло не так с оформлением оплаты',
      );
    }

    await this.db.insert(schema.orders).values({
      id: payment.id,
      type: body.type,
      userId: user.id,
      metadata: orderMetadata,
    });

    if (!payment.confirmation || !payment.confirmation.confirmation_url) {
      throw new InternalServerErrorException(
        'Что-то пошло не так с оформлением ссылки на оплату',
      );
    }

    return { confirmation_url: payment.confirmation.confirmation_url };
  }

  @TypedRoute.Patch(':orderId')
  async confirmOrder(
    @TypedParam('orderId') orderId: string,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      const order = await tx.query.orders.findFirst({
        where: eq(schema.orders.id, orderId),
      });

      if (!order) {
        throw new BadRequestException('Нет такого заказа');
      }

      if (order.confirmed) {
        throw new BadRequestException('Заказ уже оплачен');
      }

      const payment = await checkout.getPayment(order.id).catch(() => null);

      if (!payment) {
        throw new BadRequestException();
      }

      if (order.type === 'release') {
        const releaseResult = await releaseMetadataSchema.safeParseAsync(
          order.metadata,
        );

        if (!releaseResult.success) {
          throw new InternalServerErrorException('Неверные метаданные заказа');
        }

        await tx
          .update(schema.release)
          .set({ confirmed: true })
          .where(eq(schema.release.id, releaseResult.data.releaseId));
      }

      if (order.type === 'subscription') {
        const subscriptionResult = subscriptionMetadataSchema.safeParse(
          order.metadata,
        );

        if (!subscriptionResult.success) {
          throw new InternalServerErrorException('Неверные метаданные заказа');
        }

        const currentDate = new Date();

        const expireDate = new Date(currentDate);

        expireDate.setMonth(currentDate.getMonth() + 1);
        expireDate.setHours(0);
        expireDate.setMinutes(0);
        expireDate.setSeconds(0);
        expireDate.setMilliseconds(0);

        await tx
          .update(schema.users)
          .set({
            isSubscribed: true,
            subscriptionLevel: subscriptionResult.data.subscriptionLevel,
            freeReleases:
              premiumPlans[subscriptionResult.data.subscriptionLevel!]
                .freeReleases,
          })
          .where(eq(schema.users.id, order.userId));
      }

      await tx
        .update(schema.orders)
        .set({ confirmed: true })
        .where(eq(schema.orders.id, order.id));
    });

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Get('/payouts')
  async getPayoutTickets(
    @TypedQuery() params: TGetPayoutTicketsQuery,
  ): Promise<TGetPayoutTicketsResponse> {
    return {
      data: await this.db.query.payouts.findMany({
        where: eq(schema.payouts.confirmed, params.confirmed ?? false),
        limit: params.size,
        offset: (params.page - 1) * params.size,
      }),
    };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Get('/payouts/my')
  async getMyPayoutTickets(
    @Session() sessionToken: string,
    @TypedQuery() params: TGetPayoutTicketsQuery,
  ): Promise<TGetPayoutTicketsResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new UnauthorizedException('Не авторизован');

    return {
      data: await this.db.query.payouts.findMany({
        where: and(
          eq(schema.payouts.confirmed, params.confirmed ?? false),
          eq(schema.payouts.userId, user?.id),
        ),
        limit: params.size,
        offset: (params.page - 1) * params.size,
      }),
    };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Get('/payouts/:ticketId')
  async getPayoutTicket(
    @TypedParam('ticketId') ticketId: string,
    @Session() sessionToken: string,
  ): Promise<TGetPayoutTicketResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new UnauthorizedException('Не авторизован');

    const ticket = await this.db.query.payouts.findFirst({
      where: eq(schema.payouts.id, ticketId),
    });

    if (!ticket) throw new NotFoundException('Тикет не найден');

    if (ticket.userId !== user.id || !user.isAdmin)
      throw new ForbiddenException('Нет доступа');

    return {
      data: ticket,
    };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Post('/payouts')
  async createPayoutTicket(
    @Session() sessionToken: string,
    @TypedBody() body: TCreatePayoutTicketBody,
  ): Promise<TSuccessionResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new UnauthorizedException('Не авторизован');

    await this.db.insert(schema.payouts).values({
      userId: user.id,
      amount: body.data.amount,
      recieverName: body.data.recieverName,
      accountNumber: body.data.accountNumber,
      confirmed: false,
    });

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Patch('/payouts/:ticketId/status')
  async updatePayoutTicketStatus(
    @TypedParam('ticketId') ticketId: string,
    @TypedBody() body: TUpdatePayoutTicketStatusBody,
  ): Promise<TSuccessionResponse> {
    await this.db
      .update(schema.payouts)
      .set({
        confirmed: body.data.confirmed,
      })
      .where(eq(schema.payouts.id, ticketId));

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Get('/subscription/:level')
  getSubscriptionEstimate(
    @TypedParam('level')
    level: Primitive<NonNullable<TSelectUserSchema['subscriptionLevel']>>,
  ): TGetSubscriptionEstimateResponse {
    const result = this.financeService.calculateSubscriptionEstimate(level);

    return {
      data: result,
    };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Get('/release/:releaseId')
  async getReleaseEstimate(
    @Session() sessionToken: string,
    @TypedParam('releaseId') releaseId: string,
  ): Promise<TGetReleaseEstimateResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) {
      throw new UnauthorizedException('Не авторизован');
    }

    const release = await this.db.query.release.findFirst({
      where: eq(schema.release.id, releaseId),
    });

    if (!release || release.authorId !== user.id) {
      throw new NotFoundException('Релиз не найден');
    }

    const result = await this.financeService.calculateReleaseEstimate(
      releaseId,
      user.subscriptionLevel ?? 'none',
    );

    return {
      data: result,
    };
  }
}
