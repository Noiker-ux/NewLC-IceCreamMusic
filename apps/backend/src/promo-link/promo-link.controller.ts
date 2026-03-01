import { TypedBody, TypedParam, TypedRoute } from '@nestia/core';
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
import { DB, schema } from 'db';
import { and, eq, InferSelectModel } from 'drizzle-orm';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { SessionService } from '../auth/session.service';
import { TSuccessionResponse } from '../shared/types/response';

export type TPromoUrl = InferSelectModel<typeof schema.promoUrls>;

export type TPromoLink = InferSelectModel<typeof schema.promoLinks>;

export type TRelease = InferSelectModel<typeof schema.release>;

export type TPromoData = InferSelectModel<typeof schema.promoLinks>;

export type TGetPromoLinksResponse = TPromoData[];

export type TGetPromoLinkResponse = {
  promoLink: TPromoLink;
  urls: TPromoUrl[];
  release: TRelease;
};

export type TCreatePromoLinkBody = {
  promoLink: Omit<TPromoLink, 'id'>;
  urls: Omit<TPromoUrl, 'id' | 'promoLinkId'>[];
};

export type TUpdatePromoLinkBody = {
  data: Partial<Omit<TPromoLink, 'id' | 'releaseId'>>;
};

export type TAddPromoUrlBody = Omit<TPromoUrl, 'id' | 'promoLinkId'>;

@ApiTags('promo-links')
@Controller({ version: '1', path: 'promo-links' })
export class PromoLinkController {
  logger = new Logger(PromoLinkController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly sessionSrevice: SessionService,
  ) {}

  @TypedRoute.Get(':promoLinkId')
  async getPromoLinkById(
    @TypedParam('promoLinkId') promoLinkId: string,
  ): Promise<TGetPromoLinkResponse> {
    const promoLink = await this.db.query.promoLinks.findFirst({
      where: eq(schema.promoLinks.id, promoLinkId),
      with: { urls: true, release: true },
    });

    if (!promoLink) throw new BadRequestException('Промо ссылка не найдена');

    const { urls, release, ...linkData } = promoLink;

    return { promoLink: linkData, urls, release };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Get(':releaseId')
  async getPromoLinkByRelease(
    @TypedParam('releaseId') releaseId: string,
    @Session() sessionToken: string,
  ): Promise<TGetPromoLinkResponse> {
    const { user } = await this.sessionSrevice.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Недостаточно прав');

    const existingRelease = await this.db.query.release.findFirst({
      where: and(eq(schema.release.id, releaseId)),
    });

    if (!existingRelease) throw new BadRequestException('Релиз не найден');

    if (!(user.isAdmin || existingRelease.authorId === user.id))
      throw new ForbiddenException('Недостаточно прав');

    const promoLink = await this.db.query.promoLinks.findFirst({
      where: eq(schema.promoLinks.releaseId, existingRelease.id),
      with: { urls: true, release: true },
    });

    if (!promoLink) throw new BadRequestException('Промо ссылка не найдена');

    const { urls, release, ...linkData } = promoLink;

    return { promoLink: linkData, urls, release };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Post()
  async createPromoLink(
    @TypedBody() body: TCreatePromoLinkBody,
    @Session() sessionToken: string,
  ): Promise<TSuccessionResponse> {
    const { urls, promoLink } = body;

    const { user } = await this.sessionSrevice.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Не авторизован');

    await this.db.transaction(async (tx) => {
      const release = await tx.query.release.findFirst({
        where: eq(schema.release.id, promoLink.releaseId),
      });

      if (!release) throw new BadRequestException('Релиз не найден');

      if (release.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      const newPromoLink = (
        await tx.insert(schema.promoLinks).values(promoLink).returning()
      ).at(0);

      if (!newPromoLink)
        throw new InternalServerErrorException(
          'Промо ссылка не была добавлена',
        );

      const newUrlsData = urls.map((u) => ({
        ...u,
        promoLinkId: newPromoLink.id,
      }));

      const createdUrls = await tx
        .insert(schema.promoUrls)
        .values(newUrlsData)
        .returning();

      if (createdUrls.length !== urls.length)
        throw new InternalServerErrorException('Не все ссылки были добавлены');
    });

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Patch(':promoLinkId')
  async updatePromoLink(
    @TypedParam('promoLinkId') promoLinkId: string,
    @TypedBody() body: TUpdatePromoLinkBody,
    @Session() sessionToken: string,
  ): Promise<TSuccessionResponse> {
    const { user } = await this.sessionSrevice.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Не авторизован');

    await this.db.transaction(async (tx) => {
      const promoLink = await tx.query.promoLinks.findFirst({
        where: eq(schema.promoLinks.id, promoLinkId),
        with: {
          release: true,
        },
      });

      if (!promoLink) throw new Error('Промо ссылка не найдена');

      if (promoLink.release.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      const result = await tx
        .update(schema.promoLinks)
        .set(body.data)
        .where(eq(schema.promoLinks.id, promoLinkId));

      if (result.rowCount !== 1)
        throw new InternalServerErrorException(
          'Не удалось обновить промо ссылку',
        );
    });

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Post(':promoLinkId/urls')
  async addPromoUrl(
    @TypedParam('promoLinkId') promoLinkId: string,
    @Session() sessionToken: string,
    @TypedBody() body: TAddPromoUrlBody,
  ): Promise<TSuccessionResponse> {
    const { user } = await this.sessionSrevice.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Не авторизован');

    await this.db.transaction(async (tx) => {
      const promoLink = await tx.query.promoLinks.findFirst({
        where: eq(schema.promoLinks.id, promoLinkId),
        with: { release: true },
      });

      if (!promoLink) throw new BadRequestException('Промо ссылка не найдена');

      if (promoLink.release.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      const newUrl = (
        await tx
          .insert(schema.promoUrls)
          .values({ ...body, promoLinkId: promoLink.id })
          .returning()
      ).at(0);

      if (!newUrl)
        throw new InternalServerErrorException('Не удалось добавить ссылку');
    });

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Delete(':promoLinkId/urls/:urlId')
  async deletePromoUrl(
    @TypedParam('urlId') urlId: string,
    @TypedParam('promoLinkId') promoLinkId: string,
    @Session() sessionToken: string,
  ): Promise<TSuccessionResponse> {
    const { user } = await this.sessionSrevice.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Не авторизован');

    await this.db.transaction(async (tx) => {
      const promoLink = await tx.query.promoLinks.findFirst({
        where: eq(schema.promoLinks.id, promoLinkId),
        with: { release: true },
      });

      if (!promoLink) throw new BadRequestException('Промо ссылка не найдена');

      if (promoLink.release.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      const result = await tx
        .delete(schema.promoUrls)
        .where(eq(schema.promoUrls.id, urlId));

      if (result.rowCount !== 1)
        throw new InternalServerErrorException('Не удалось удалить ссылку');
    });

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @TypedRoute.Delete(':promoLinkId')
  async deletePromoLink(
    @TypedParam('promoLinkId') promoLinkId: string,
    @Session() sessionToken: string,
  ): Promise<TSuccessionResponse> {
    const { user } = await this.sessionSrevice.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Не авторизован');

    await this.db.transaction(async (tx) => {
      const promoLink = await tx.query.promoLinks.findFirst({
        where: eq(schema.promoLinks.id, promoLinkId),
        with: { release: true },
      });

      if (!promoLink) throw new BadRequestException('Промо ссылка не найдена');

      if (promoLink.release.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      const result = await tx
        .delete(schema.promoLinks)
        .where(eq(schema.promoLinks.id, promoLinkId));

      if (result.rowCount !== 1)
        throw new InternalServerErrorException(
          'Не удалось удалить промо ссылку',
        );
    });

    return { success: true };
  }
}
