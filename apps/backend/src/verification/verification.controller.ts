import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  ForbiddenException,
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { schema, type DB } from 'db';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { Primitive } from 'typia';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { SessionService } from '../auth/session.service';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { VerificationService } from './verification.service';

export type TVerification = InferSelectModel<typeof schema.verification>;

export type VerificationTicketsResponse = TVerification[];

export type TStatus = 'approved' | 'rejected' | 'moderating';

export type TTicketRegistrationData = {
  data: Primitive<
    Omit<
      InferInsertModel<typeof schema.verification>,
      'rejectReason' | 'status' | 'userId' | 'id'
    >
  >;
};

export type TTicketStatusUpdateData = {
  status: TStatus;
};

export type TTicketUpdateBody = {
  data: Partial<TTicketRegistrationData['data']>;
};

export type TRegisterVerificationTicketResponse = {
  data: {
    contract: string;
  };
};

export type TGetVerificationToken = {
  data: TVerification | null;
};

export type TGetDownloadUrl = {
  data: {
    contract: string;
  };
};

export type TUpdateCurrentVerificationTicketResponse = {
  data: {
    contract: string | null;
  };
};

@ApiTags('verification')
@Controller('verification')
@ApiSecurity('bearer')
@UseGuards(AuthGuard)
export class VerificationController {
  logger = new Logger(VerificationController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly sessionService: SessionService,
    private readonly verificationService: VerificationService,
  ) {}

  @AdminGuard()
  @TypedRoute.Get('/:status')
  async getVerificationTickets(
    @TypedParam('status') status: TStatus,
    @TypedQuery() pageData: TPageQuery = { page: 1, size: 10 },
  ): Promise<VerificationTicketsResponse> {
    const tickets = await this.db.query.verification.findMany({
      where: eq(schema.verification.status, status),
      limit: pageData.size,
      offset: (pageData.page - 1) * pageData.size,
    });

    return tickets;
  }

  @TypedRoute.Post()
  async registerVerifiactionTicket(
    @TypedBody() body: TTicketRegistrationData,
    @Session() sessionToken: string,
  ): Promise<TRegisterVerificationTicketResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Недостаточно прав');

    if (user.isVerifiedAuthor)
      throw new BadRequestException('Вы уже верифицированы');

    const { getDate, birthDate, ...insertionData } = body.data;

    const ticket = await this.db
      .insert(schema.verification)
      .values({
        userId: user.id,
        ...insertionData,
        getDate: new Date(getDate),
        birthDate: new Date(birthDate),
      })
      .returning()
      .then((result) => result[0])
      .catch((e) => this.logger.error(e));

    if (!ticket) throw new InternalServerErrorException('Что-то пошло не так');

    const uploadContractUrl = await this.verificationService.createPublicUrl(
      `${ticket.id}.${ticket.contract}`,
    );

    return {
      data: {
        contract: uploadContractUrl,
      },
    };
  }

  @TypedRoute.Get('/current')
  async getCurrentUserVerificationTicket(
    @Session() sessionToken: string,
  ): Promise<TGetVerificationToken> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Недостаточно прав');

    const ticket = await this.db.query.verification.findFirst({
      where: eq(schema.verification.userId, user.id),
    });

    if (!ticket)
      return {
        data: null,
      };

    return { data: ticket };
  }

  @TypedRoute.Patch('/current')
  async updateCurrentUserVerificationTicket(
    @Session() sessionToken: string,
    @TypedBody() body: TTicketUpdateBody,
  ): Promise<TUpdateCurrentVerificationTicketResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Недостаточно прав');

    const ticket = await this.db.query.verification.findFirst({
      where: eq(schema.verification.userId, user.id),
    });

    if (!ticket) throw new BadRequestException('Тикета не существует');

    const birthDate = body.data.birthDate
      ? new Date(body.data.birthDate)
      : undefined;

    const getDate = body.data.getDate ? new Date(body.data.getDate) : undefined;

    await this.db
      .update(schema.verification)
      .set({ ...body.data, birthDate, getDate })
      .where(eq(schema.verification.id, ticket.id));

    if (body.data.contract) {
      const uploadContractUrl = await this.verificationService.createPublicUrl(
        `${ticket.id}.${ticket.contract}`,
      );

      return {
        data: {
          contract: uploadContractUrl,
        },
      };
    }

    return {
      data: {
        contract: null,
      },
    };
  }

  @AdminGuard()
  @TypedRoute.Get(':ticketId/contract')
  async getContractDownloadUrl(
    @TypedParam('ticketId') ticketId: string,
  ): Promise<TGetDownloadUrl> {
    const contractDownloadUrl =
      await this.verificationService.getPublicUrl(ticketId);

    if (!contractDownloadUrl)
      throw new BadRequestException('Тикета не существует');

    return {
      data: {
        contract: contractDownloadUrl,
      },
    };
  }

  @TypedRoute.Patch(':ticketId')
  async updateTicket(
    @TypedParam('ticketId') ticketId: string,
    @TypedBody() body: TTicketUpdateBody,
  ): Promise<TSuccessionResponse> {
    const { data } = body;

    await this.db.transaction(async (tx) => {
      const existingTicket = await tx.query.verification.findFirst({
        where: eq(schema.verification.id, ticketId),
      });

      if (!existingTicket) return;

      const birthDate = data.birthDate ? new Date(data.birthDate) : undefined;

      const getDate = data.getDate ? new Date(data.getDate) : undefined;

      await tx
        .update(schema.verification)
        .set({ ...data, birthDate, getDate })
        .where(eq(schema.verification.id, existingTicket.id));
    });

    return { success: true };
  }

  @AdminGuard()
  @TypedRoute.Patch(':ticketId/status')
  async updateTicketStatus(
    @TypedParam('ticketId') ticketId: string,
    @TypedBody() body: TTicketStatusUpdateData,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      const ticket = await tx.query.verification.findFirst({
        where: eq(schema.verification.id, ticketId),
      });

      if (!ticket) throw new BadRequestException('Тикета не существует');

      if (body.status === 'rejected') {
        tx.update(schema.users)
          .set({ isVerifiedAuthor: false })
          .where(eq(schema.users.id, ticket.userId));
      }

      if (body.status === 'approved') {
        tx.update(schema.users)
          .set({ isVerifiedAuthor: true })
          .where(eq(schema.users.id, ticket.userId));
      }

      await tx
        .update(schema.verification)
        .set({ status: body.status })
        .where(eq(schema.verification.id, ticketId));
    });

    return { success: true };
  }
}
