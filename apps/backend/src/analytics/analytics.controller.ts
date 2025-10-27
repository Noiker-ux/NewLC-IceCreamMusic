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
import { ApiTags } from '@nestjs/swagger';
import { DB, schema } from 'db';
import { eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { TSuccessionResponse } from '../shared/types';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { SessionService } from '../auth/session.service';
import { TPageQuery } from '../shared/types';
import { AnalyticsService } from './analytics.service';

export type TAnalytics = InferSelectModel<typeof schema.analytics>;

export type TInsertAnalytics = Omit<
  InferInsertModel<typeof schema.analytics>,
  'id'
>;

export type TGetAnalyticsListResponse = {
  data: TAnalytics[];
};

export type TGetAnalyticsResponse = {
  data: TAnalytics;
};

export type TCreateAnalyticsBody = {
  data: TInsertAnalytics;
};

export type TUpdateAnalyticsBody = {
  data: Partial<Omit<TInsertAnalytics, 'userId'>>;
};

export type TUpdateAnalyticsRespomse = {
  report: string;
};

@ApiTags('analytics')
@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'analytics' })
export class AnalyticsController {
  logger = new Logger(AnalyticsController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly sessionService: SessionService,
    private readonly analyticsService: AnalyticsService,
  ) {}

  @TypedRoute.Get('/my')
  async getMyAnalytics(
    @Session() sessionToken: string,
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetAnalyticsListResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    const analyticsData = await this.db.query.analytics.findMany({
      where: eq(schema.analytics.userId, user.id),
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });

    return { data: analyticsData };
  }

  @TypedRoute.Get(':analyticsId')
  async getAnalyticsById(
    @Session() sessionToken: string,
    @TypedParam('analyticsId') analyticsId: string,
  ): Promise<TGetAnalyticsResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    const analytics = await this.db.query.analytics.findFirst({
      where: eq(schema.analytics.id, analyticsId),
    });

    if (!analytics) throw new BadRequestException('Аналитика не найдена');

    if (analytics.userId !== user.id && !user.isAdmin)
      throw new ForbiddenException('Недостаточно прав для просмотра аналитики');

    return { data: analytics };
  }

  @AdminGuard()
  @TypedRoute.Get('/user/:userId')
  async getUserAnalytics(
    @TypedParam('userId') userId: string,
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetAnalyticsListResponse> {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
      with: {
        analytics: true,
      },
    });

    if (!user) throw new BadRequestException('Пользователь не найден');

    const analyticsData = await this.db.query.analytics.findMany({
      where: eq(schema.analytics.userId, user.id),
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });

    return { data: analyticsData };
  }

  @AdminGuard()
  @TypedRoute.Post()
  async createAnalytics(
    @TypedBody() body: TCreateAnalyticsBody,
  ): Promise<TUpdateAnalyticsRespomse> {
    const reportUrl = await this.db.transaction(async (tx) => {
      const periodStart = new Date(body.data.periodStart);
      const periodFinish = new Date(body.data.periodFinish);

      if (periodStart > periodFinish)
        throw new BadRequestException('Неправильный период');

      const newAnalytics = (
        await tx
          .insert(schema.analytics)
          .values({ ...body.data, periodStart, periodFinish })
          .returning()
      ).at(0);

      if (!newAnalytics)
        throw new InternalServerErrorException('Что-то пошло не так');

      const { reportFileUrl } = newAnalytics;

      const reportPublicUrl = reportFileUrl
        ? await this.analyticsService.createPutUrl(
            `${newAnalytics.id}.${reportFileUrl}`,
          )
        : '';

      return reportPublicUrl;
    });

    return { report: reportUrl };
  }

  @AdminGuard()
  @TypedRoute.Patch(':analyticsId')
  async updateAnalytics(
    @TypedBody() body: TUpdateAnalyticsBody,
    @TypedParam('analyticsId') analyticsId: string,
  ): Promise<TUpdateAnalyticsRespomse> {
    const reportUrl = await this.db.transaction(async (tx) => {
      const analytics = await tx.query.analytics.findFirst({
        where: eq(schema.analytics.id, analyticsId),
      });
      if (!analytics) throw new BadRequestException('Аналитика не найдена');

      const periodStart = body.data.periodStart
        ? new Date(body.data.periodStart)
        : undefined;
      const periodFinish = body.data.periodFinish
        ? new Date(body.data.periodFinish)
        : undefined;

      if (!!periodStart && !!periodFinish && periodStart > periodFinish)
        throw new BadRequestException('Неправильный период');

      const updatedAnalytics = (
        await tx
          .update(schema.analytics)
          .set({ ...body.data, periodStart, periodFinish })
          .where(eq(schema.analytics.id, analyticsId))
          .returning()
      ).at(0);

      if (!updatedAnalytics)
        throw new InternalServerErrorException('Что-то пошло не так');

      const reportFileUrl =
        body.data.reportFileUrl && body.data.reportFileUrl
          ? await this.analyticsService.createPutUrl(
              `${updatedAnalytics.id}.${updatedAnalytics.reportFileUrl}`,
            )
          : '';

      return reportFileUrl;
    });

    return { report: reportUrl };
  }

  @AdminGuard()
  @TypedRoute.Delete(':analyticsId')
  async deleteAnalytics(
    @TypedParam('analyticsId') analyticsId: string,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      const analytics = await tx.query.analytics.findFirst({
        where: eq(schema.analytics.id, analyticsId),
      });

      if (!analytics) throw new BadRequestException('Аналитика не найдена');

      await tx
        .delete(schema.analytics)
        .where(eq(schema.analytics.id, analyticsId));

      await this.analyticsService.removeAnalyticsReport(
        `${analytics.id}.${analytics.reportFileUrl}`,
      );
    });

    return { success: true };
  }
}
