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
import { ApiTags } from '@nestjs/swagger';

export type TVerification = InferSelectModel<typeof schema.verification>;

export type VerificationTicketsResponse = TVerification[];

export type TStatus = 'approved' | 'rejected' | 'moderating';

export type TTicketRegistrationData = Omit<
  InferInsertModel<typeof schema.verification>,
  'rejectReason' | 'status'
>;

export type TTicketStatusUpdateData = {
  status: TStatus;
};

@ApiTags('verification')
@Controller('verification')
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
    const rows = await this.db
      .insert(schema.verification)
      .values(body)
      .catch((e) => this.logger.error(e));

    if (!rows) throw new InternalServerErrorException('Что-то пошло не так');

    return { success: true };
  }

  @TypedRoute.Patch(':ticketId')
  async updateTicketStatus(
    @TypedParam('ticketId') ticketId: string,
    @TypedBody() body: TTicketStatusUpdateData,
  ): Promise<TSuccessionResponse> {
    const { status } = body;
    const ticket = await this.db.transaction(async (tx) => {
      const existingTicket = await tx.query.verification.findFirst({
        where: eq(schema.verification.id, ticketId),
      });

      if (!existingTicket) return;

      await tx
        .update(schema.verification)
        .set({ status })
        .where(eq(schema.verification.id, existingTicket.id));

      return existingTicket;
    });

    if (!ticket)
      throw new BadRequestException('Тикета с переданным id не существует');

    return { success: true };
  }
}
