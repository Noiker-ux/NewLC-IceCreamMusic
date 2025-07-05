import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { type DB, schema } from 'db';
import { eq, InferSelectModel } from 'drizzle-orm';
import { AuthGuard } from '../auth/auth.guard';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { AdminGuard } from '../auth/admin.guard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

export type TFAQData = InferSelectModel<typeof schema.faq>;

export type TGetFAQResponse = TFAQData[];

export type TCreateFAQBody = Omit<TFAQData, 'id'>;

export type TUpdateFAQBody = Partial<TCreateFAQBody>;

@ApiTags('FAQ')
@Controller('faq')
export class FAQController {
  logger = new Logger(FAQController.name);

  constructor(@Inject('DB_TAG') private readonly db: DB) {}

  @TypedRoute.Get()
  async getFAQData(
    @TypedQuery() params: TPageQuery = { page: 1, size: 10 },
  ): Promise<TGetFAQResponse> {
    return await this.db.query.faq.findMany({
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Post()
  async createFAQ(
    @TypedBody() faqData: TCreateFAQBody,
  ): Promise<TSuccessionResponse> {
    const success = await this.db
      .insert(schema.faq)
      .values(faqData)
      .catch((e) => {
        this.logger.error(e);
        return false as const;
      });

    if (!success) {
      throw new InternalServerErrorException('Что-то пошло не так');
    }

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Patch(':faqId')
  async updateFAQ(
    @TypedParam('faqId') faqId: string,
    @TypedBody() body: TUpdateFAQBody,
  ): Promise<TSuccessionResponse> {
    const success = await this.db
      .update(schema.faq)
      .set(body)
      .where(eq(schema.faq.id, faqId))
      .catch((e) => {
        this.logger.error(e);
        return false;
      });

    if (!success) {
      throw new InternalServerErrorException('Что-то пошло не так');
    }

    return {
      success: true,
    };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Delete(':faqId')
  async deleteFAQ(
    @TypedParam('faqId') faqId: string,
  ): Promise<TSuccessionResponse> {
    const success = await this.db
      .delete(schema.faq)
      .where(eq(schema.faq.id, faqId))
      .catch((e) => {
        this.logger.error(e);
        return false;
      });

    if (!success) {
      throw new InternalServerErrorException('Что-то пошло не так');
    }

    return { success: true };
  }
}
