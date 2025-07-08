import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { schema, type DB } from 'db';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Primitive } from 'typia';

export type TVerification = InferSelectModel<typeof schema.verification>;

export type VerificationTicketsResponse = TVerification[];

export type TStatus = 'approved' | 'rejected' | 'moderating';

export type TTicketRegistrationData = {
  data: Primitive<
    Omit<
      InferInsertModel<typeof schema.verification>,
      'rejectReason' | 'status'
    >
  >;
};

export type TTicketStatusUpdateData = {
  status: TStatus;
};

export type TTicketUpdateBody = {
  data: Partial<TTicketRegistrationData['data']>;
};

@ApiTags('verification')
@Controller('verification')
@ApiSecurity('bearer')
@UseGuards(AuthGuard)
export class VerificationController {
  logger = new Logger(VerificationController.name);

  constructor(@Inject('DB_TAG') private readonly db: DB) {}

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
  ): Promise<TSuccessionResponse> {
    const { getDate, birthDate, ...insertionData } = body.data;

    const rows = await this.db
      .insert(schema.verification)
      .values({
        ...insertionData,
        getDate: new Date(getDate),
        birthDate: new Date(birthDate),
      })
      .catch((e) => this.logger.error(e));

    if (!rows) throw new InternalServerErrorException('Что-то пошло не так');

    return { success: true };
  }

  // @AdminGuard()
  // @TypedRoute.Delete(':ticketId')
  // async deleteTicket() {}

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
