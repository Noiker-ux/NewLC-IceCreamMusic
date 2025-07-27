import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { DB, schema } from 'db';
import { eq, InferSelectModel } from 'drizzle-orm';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { NewsService } from './news.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

export type TNewsData = InferSelectModel<typeof schema.news>;

export type TGetNewsResponse = TNewsData[];

export type TCreateNewsDataBody = Omit<TNewsData, 'id' | 'createdAt'>;

export type TUpdateNewsDataBody = Partial<TCreateNewsDataBody>;

export type TUpdateNewsResponse = {
  preview: string;
};

export type TGetNewsByIdResponse = {
  data: TNewsData;
};

@ApiTags('news')
@Controller('news')
export class NewsController {
  logger = new Logger(NewsController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly newsService: NewsService,
  ) {}

  @TypedRoute.Get()
  async getNews(@TypedQuery() params: TPageQuery): Promise<TGetNewsResponse> {
    return await this.db.query.news.findMany({
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });
  }

  @TypedRoute.Get(':newsId')
  async getNewsById(
    @TypedParam('newsId') newsId: string,
  ): Promise<TGetNewsByIdResponse> {
    const news = await this.db.query.news.findFirst({
      where: eq(schema.news.id, newsId),
    });

    if (!news) throw new BadRequestException('Новость не найдена');

    return { data: news };
  }

  // ! Поправить ссылки на превью новостей
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Post()
  async createNews(
    @TypedBody() body: TCreateNewsDataBody,
  ): Promise<TUpdateNewsResponse> {
    const previewUrl = await this.db
      .transaction(async (tx) => {
        const createdNews = (
          await tx.insert(schema.news).values(body).returning()
        ).at(0);

        if (!createdNews) {
          throw new Error('Новость не была добавлена');
        }

        return await this.newsService.createPreviewPostUrl(
          `${createdNews.id}.${createdNews.preview}`,
        );
      })
      .catch((e) => {
        this.logger.error(e);
        return false as const;
      });

    if (!previewUrl) {
      throw new InternalServerErrorException('Что-то пошло не так');
    }

    return { preview: previewUrl };
  }

  // ! Поправить ссылки на превью новостей
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Patch(':newsId')
  async updateNews(
    @TypedBody() body: TUpdateNewsDataBody,
    @TypedParam('newsId') newsId: string,
  ): Promise<TUpdateNewsResponse> {
    const prviewUrl = await this.db
      .transaction(async (tx) => {
        const existingNews = await tx.query.news.findFirst({
          where: eq(schema.news.id, newsId),
        });

        if (!existingNews) {
          throw new Error('Новость не была найдена');
        }

        const updatedNews = (
          await tx
            .update(schema.news)
            .set(body)
            .where(eq(schema.news.id, newsId))
            .returning()
        ).at(0);

        if (!updatedNews) {
          throw new Error('Новость не была обновлена');
        }

        return await this.newsService.createPreviewPostUrl(
          `${newsId}.${updatedNews.preview}`,
        );
      })
      .catch((e) => {
        this.logger.error(e);
        return false as const;
      });

    if (!prviewUrl) {
      throw new InternalServerErrorException(
        'Что-то пошло не так при обновлении новости',
      );
    }

    if (!body.preview) {
      return { preview: '' };
    }

    return { preview: prviewUrl };
  }

  // ! Поправить ссылки на превью новостей
  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Delete(':newsId')
  async deleteNews(
    @TypedParam('newsId') newsId: string,
  ): Promise<TSuccessionResponse> {
    const success = await this.db
      .transaction(async (tx) => {
        const qwe = (
          await tx
            .delete(schema.news)
            .where(eq(schema.news.id, newsId))
            .returning()
        ).at(0);

        if (!qwe) throw new Error('Новость не обнаружена');

        await this.newsService.deleteObject(`${qwe.id}.${qwe.preview}`);

        return true;
      })
      .catch((e) => {
        this.logger.error(e);
        return false as const;
      });

    if (!success) throw new InternalServerErrorException('Что-то пошло не так');

    return { success: true };
  }
}
