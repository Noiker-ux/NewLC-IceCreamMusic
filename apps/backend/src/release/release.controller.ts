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
import { DB, schema } from 'db';
import { and, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  releaseAreaSchema,
  releaseRolesSchema,
  trackRolesSchema,
} from 'shared/schema/release.schema';
import { Primitive } from 'typia';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { SessionService } from '../auth/session.service';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { ReleaseService } from './release.sercice';
import { FinanceService } from '../finance/finance.service';
import { Payment } from '@a2seven/yoo-checkout';

export type TPromoLink = InferSelectModel<typeof schema.promoLinks>;

export type TTrack = InferSelectModel<typeof schema.track>;

export type TRelease = InferSelectModel<typeof schema.release>;

export type TCompleteReleaseData = TRelease & {
  tracks: TTrack[];
  promoLinks: TPromoLink[];
};

export type TGetReleaseListResponse = {
  data: TCompleteReleaseData[];
};

export type TGetSpecificReleaseResponse = {
  data: TCompleteReleaseData;
};

export type TReleaseInsert = Primitive<
  Omit<
    InferInsertModel<typeof schema.release>,
    'id' | 'authorId' | 'confirmed' | 'status' | 'rejectReason'
  >
>;

export type TTrackInsert = Primitive<
  Omit<InferInsertModel<typeof schema.track>, 'id' | 'releaseId' | 'index'>
>;

export type TCreateReleaseBody = {
  release: TReleaseInsert;
  tracks: TTrackInsert[];
};

export type TCreateReleaseResponse = {
  preview: string;
  tracks: {
    track: string;
    text_sync?: string;
    video?: string;
    video_shot?: string;
    ringtone?: string;
  }[];
};

export type TUpdateTrackBody = {
  data: Primitive<Partial<Omit<TTrack, 'id' | 'releaseId'>>>;
};

export type TUpdateTrackResponse = {
  track?: string;
  text_sync?: string;
  video?: string;
  video_shot?: string;
  ringtone?: string;
};

export type TUpdateReleaseBody = { data: Primitive<Partial<TReleaseInsert>> };

export type TUpdateReleaseResponse = {
  preview?: string;
};

export type TUpdateReleaseStatusBody = {
  data: TRelease['status'];
};

export type TGetReleasePriceResponse = {
  data: Payment['receipt']['items'];
};

@ApiTags('releases')
@ApiSecurity('bearer')
@UseGuards(AuthGuard)
@Controller('releases')
export class ReleaseController {
  logger = new Logger(ReleaseController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly sessionService: SessionService,
    private readonly releaseService: ReleaseService,
    private readonly financeService: FinanceService,
  ) {}

  @TypedRoute.Get('my')
  async getMyReleases(
    @Session() sessionToken: string,
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetReleaseListResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    const releases = await this.db.query.release.findMany({
      where: eq(schema.release.authorId, user.id),
      with: { tracks: true, promoLinks: true },
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });

    return { data: releases };
  }

  @TypedRoute.Get(':releaseId')
  async getReleaseById(
    @Session() sessionToken: string,
    @TypedParam('releaseId') releaseId: string,
  ): Promise<TGetSpecificReleaseResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    const release = await this.db.query.release.findFirst({
      where: eq(schema.release.id, releaseId),
      with: {
        tracks: true,
        promoLinks: true,
      },
    });

    if (!release) throw new BadRequestException('Релиз не найден');

    if (release.authorId !== user.id || !user.isAdmin)
      throw new ForbiddenException('Недостаточно прав для просмотра релиза');

    return { data: release };
  }

  @TypedRoute.Get(':releaseId/price')
  async getReleasePrice(
    @Session() sessionToken: string,
    @TypedParam('releaseId') releaseId: string,
  ) {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    const release = await this.db.query.release.findFirst({
      where: eq(schema.release.id, releaseId),
    });

    if (!release || release.authorId !== user.id)
      throw new BadRequestException('Релиз не найден');

    const subscriptionLevel = user.subscriptionLevel ?? 'none';

    return this.financeService.calculateReleaseEstimate(
      release.id,
      subscriptionLevel,
    );
  }

  @AdminGuard()
  @TypedRoute.Get('/user/:userId')
  async getUserReleases(
    @TypedParam('userId') userId: string,
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetReleaseListResponse> {
    const releases = await this.db.query.release.findMany({
      where: eq(schema.release.authorId, userId),
      with: { tracks: true, promoLinks: true },
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });

    return { data: releases };
  }

  // @TypedRoute.Get(':releaseId/tracks')
  // async getReleaseTracks() {}

  // @TypedRoute.Get(':releaseId/tracks/:trackId')
  // async getReleaseTrack() {}

  @TypedRoute.Post()
  async createRelease(
    @Session() sessionToken: string,
    @TypedBody() body: TCreateReleaseBody,
  ): Promise<TCreateReleaseResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    if (!user.isVerifiedAuthor) {
      throw new ForbiddenException(
        'Необходимо подтвердить учетную запись автора автора',
      );
    }

    const { release, tracks } = body;

    return await this.db.transaction(async (tx) => {
      const releaseRolesResult = releaseRolesSchema.safeParse(
        body.release.roles,
      );

      if (!releaseRolesResult.success)
        throw new BadRequestException('Неверные роли релиза');

      const releaseAreaResult = releaseAreaSchema.safeParse(release.area);

      if (!releaseAreaResult.success)
        throw new BadRequestException('Неверный формат площадки');

      const newRelease = (
        await tx
          .insert(schema.release)
          .values({
            ...release,
            releaseDate: new Date(release.releaseDate),
            startDate: new Date(release.startDate),
            preorderDate: new Date(release.preorderDate),
            authorId: user.id,
            yandexSoonNewRelease: release.yandexSoonNewRelease
              ? new Date(release.yandexSoonNewRelease)
              : null,
          })
          .returning()
      ).at(0);

      if (!newRelease)
        throw new InternalServerErrorException(
          'Что-то пошло не так при добавлении релиза',
        );

      const publicReleasePreviewUrl = await this.releaseService.createPutUrl(
        'previews',
        `${newRelease.id}.${newRelease.preview}`,
      );

      const trackUrls: TCreateReleaseResponse['tracks'] = [];

      for (let i = 0; i < tracks.length; i++) {
        const currentTrack = tracks[i];

        const trackRolesResult = trackRolesSchema.safeParse(currentTrack.roles);

        if (!trackRolesResult.success)
          throw new BadRequestException(
            `Не верный формат ролей в треке ${0} (${currentTrack.title})`,
          );

        const trackInstantGratification = currentTrack.instant_gratification
          ? new Date(currentTrack.instant_gratification)
          : undefined;

        const newTrack = (
          await tx
            .insert(schema.track)
            .values({
              ...currentTrack,
              roles: trackRolesResult.data,
              releaseId: newRelease.id,
              instant_gratification: trackInstantGratification,
              index: i,
            })
            .returning()
        ).at(0);

        if (!newTrack)
          throw new InternalServerErrorException(
            'Что-то пошло не так при добавлении даных трека',
          );

        const trackPublicUrl = await this.releaseService.createPutUrl(
          'tracks',
          `${newTrack.id}.${newTrack.track}`,
        );

        const trackTextSyncPublicUrl = newTrack.text_sync
          ? await this.releaseService.createPutUrl(
              'syncs',
              `${newTrack.id}.${newTrack.text_sync}`,
            )
          : undefined;

        const trackRingtonePublicUrl = newTrack.ringtone
          ? await this.releaseService.createPutUrl(
              'ringtones',
              `${newTrack.id}.${newTrack.ringtone}`,
            )
          : undefined;

        const trackVideoPublicUrl = newTrack.video
          ? await this.releaseService.createPutUrl(
              'videos',
              `${newTrack.id}.${newTrack.video}`,
            )
          : undefined;

        const trackVideoShotPublicUrl = newTrack.video_shot
          ? await this.releaseService.createPutUrl(
              'videoshots',
              `${newTrack.id}.${newTrack.video_shot}`,
            )
          : undefined;

        trackUrls.push({
          track: trackPublicUrl,
          text_sync: trackTextSyncPublicUrl,
          ringtone: trackRingtonePublicUrl,
          video: trackVideoPublicUrl,
          video_shot: trackVideoShotPublicUrl,
        });
      }

      return { preview: publicReleasePreviewUrl, tracks: trackUrls };
    });
  }

  @TypedRoute.Patch(':releaseId/tracks/:trackId')
  async updateReleaseTrack(
    @TypedParam('trackId') trackId: string,
    @TypedParam('releaseId') releaseId: string,
    @TypedBody() body: TUpdateTrackBody,
    @Session() sessionToken: string,
  ): Promise<TUpdateTrackResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    return await this.db.transaction(async (tx) => {
      const existingRelease = await tx.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
      });

      if (!existingRelease) throw new BadRequestException('Релиз не найден');

      if (existingRelease.authorId === user.id)
        throw new ForbiddenException('Недостаточно прав');

      const existingTrack = await tx.query.track.findFirst({
        where: and(
          eq(schema.track.id, trackId),
          eq(schema.track.releaseId, releaseId),
        ),
      });

      if (!existingTrack) throw new BadRequestException('Трек не найден');

      const trackRoles = trackRolesSchema.safeParse(body.data.roles);

      if (!trackRoles.success) throw new BadRequestException('Неверные роли');

      const trackInstantGratification = body.data.instant_gratification
        ? new Date(body.data.instant_gratification)
        : undefined;

      const releaseTrackUrl = body.data.track
        ? await this.releaseService.createPutUrl(
            'tracks',
            `${trackId}.${body.data.track}`,
          )
        : undefined;

      const trackTextSyncUrl = body.data.text_sync
        ? await this.releaseService.createPutUrl(
            'syncs',
            `${trackId}.${body.data.text_sync}`,
          )
        : undefined;

      const trackRingtoneUrl = body.data.ringtone
        ? await this.releaseService.createPutUrl(
            'ringtones',
            `${trackId}.${body.data.ringtone}`,
          )
        : undefined;

      const trackVideoUrl = body.data.video
        ? await this.releaseService.createPutUrl(
            'videos',
            `${trackId}.${body.data.video}`,
          )
        : undefined;

      const trackVideoShotUrl = body.data.video_shot
        ? await this.releaseService.createPutUrl(
            'videoshots',
            `${trackId}.${body.data.video_shot}`,
          )
        : undefined;

      await tx
        .update(schema.track)
        .set({
          ...body,
          instant_gratification: trackInstantGratification,
          roles: trackRoles.data,
        })
        .where(eq(schema.track.id, trackId));

      return {
        track: releaseTrackUrl,
        text_sync: trackTextSyncUrl,
        ringtone: trackRingtoneUrl,
        video: trackVideoUrl,
        video_shot: trackVideoShotUrl,
      };
    });
  }

  @TypedRoute.Patch(':releaseId')
  async updateRelease(
    @Session() sessionToken: string,
    @TypedParam('releaseId') releaseId: string,
    @TypedBody() body: TUpdateReleaseBody,
  ): Promise<TUpdateReleaseResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    const { data } = body;

    return await this.db.transaction(async (tx) => {
      const release = await tx.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
      });

      if (!release) throw new BadRequestException('Релиз не найден');

      if (release.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      const releasePreviewUrl = data.preview
        ? await this.releaseService.createPutUrl(
            'previews',
            `${releaseId}.${data.preview}`,
          )
        : '';

      const releaseDate = data.releaseDate
        ? new Date(data.releaseDate)
        : undefined;

      const startDate = data.startDate ? new Date(data.startDate) : undefined;

      const preorderDate = data.preorderDate
        ? new Date(data.preorderDate)
        : undefined;

      const yandexSoonNewRelease = data.yandexSoonNewRelease
        ? new Date(data.yandexSoonNewRelease)
        : undefined;

      await tx
        .update(schema.release)
        .set({
          ...data,
          releaseDate,
          startDate,
          preorderDate,
          yandexSoonNewRelease,
        })
        .where(eq(schema.release.id, release.id));

      return { preview: releasePreviewUrl };
    });
  }

  @TypedRoute.Delete(':releaseId')
  async deleteRelease(
    @TypedParam('releaseId') releaseId: string,
    @Session() sessionToken: string,
  ): Promise<TSuccessionResponse> {
    const { user } = await this.sessionService.validateSession(sessionToken);

    if (!user) throw new ForbiddenException('Необходима авторизация');

    await this.db.transaction(async (tx) => {
      const release = await tx.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
      });

      if (!release) throw new BadRequestException('Релиз не найден');

      if (release.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      await this.releaseService.deleteReleaseAssets(release.id);

      await tx.delete(schema.release).where(eq(schema.release.id, release.id));
    });

    return { success: true };
  }

  @AdminGuard()
  @TypedRoute.Patch(':releaseId/moderation')
  async updateReleaseModerationStatus(
    @TypedParam('releaseId') releaseId: string,
    @TypedBody() body: TUpdateReleaseStatusBody,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      await tx
        .update(schema.release)
        .set({ status: body.data })
        .where(eq(schema.release.id, releaseId));
    });

    return { success: true };
  }
}
