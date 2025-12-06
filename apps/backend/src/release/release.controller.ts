import { Payment } from '@a2seven/yoo-checkout';
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
import { and, asc, eq, InferInsertModel, InferSelectModel } from 'drizzle-orm';
import {
  authorRightsSchema,
  releaseAreaSchema,
  releaseRolesSchema,
  trackRolesSchema,
} from 'shared/schema/release.schema';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { Session } from '../auth/session.decorator';
import { SessionService, TUser } from '../auth/session.service';
import { User } from '../auth/user.decorator';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { ReleaseService } from './release.service';
import { Primitive } from 'typia';

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

export type TReleaseInsert = Omit<
  InferInsertModel<typeof schema.release>,
  'id' | 'authorId' | 'confirmed' | 'status' | 'rejectReason'
>;

export type TReleaseUpdate = Partial<TReleaseInsert>;

export type TTrackInsert = Omit<
  InferInsertModel<typeof schema.track>,
  'id' | 'releaseId' | 'index'
>;

export type TTrackUpdate = Partial<
  Omit<InferInsertModel<typeof schema.track>, 'releaseId'>
>;

export type TCreateReleaseBody = {
  release: Primitive<TReleaseInsert>;
  tracks: Primitive<TTrackInsert>[];
};

export type TCreateReleaseResponse = {
  release: Pick<TRelease, 'preview'>;
  tracks: Pick<
    TTrack,
    'track' | 'text_sync' | 'video' | 'video_shot' | 'ringtone'
  >[];
};

export type TUpdateTrackBody = {
  data: TTrackUpdate;
};

export type TUpdateTrackResponse = {
  track?: string;
  text_sync?: string;
  video?: string;
  video_shot?: string;
  ringtone?: string;
};

export type TUpdateReleaseBody = {
  release: Primitive<TReleaseUpdate>;
  tracks: Primitive<{ id: TTrack['id']; data: TTrackUpdate }>[];
};

export type TUpdateReleaseResponse = {
  release?: Partial<Pick<TRelease, 'preview'>>;
  tracks: Partial<
    Pick<TTrack, 'track' | 'text_sync' | 'video' | 'video_shot' | 'ringtone'>
  >[];
};

export type TUpdateReleaseStatusBody = {
  status: TRelease['status'];
  rejectReason?: string;
  upc?: string;
};

export type TGetReleasePriceResponse = {
  data: Payment['receipt']['items'];
};

export type TGetReleasePeice = {
  data: Payment['receipt']['items'];
};

export type TUpdateReleaseStatusResponse = {
  success: boolean;
  error?: string;
  data: {
    title: string;
    email: string;
  };
};

@ApiTags('releases')
@ApiSecurity('bearer')
@UseGuards(AuthGuard)
@Controller({ version: '1', path: 'releases' })
export class ReleaseController {
  logger = new Logger(ReleaseController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    private readonly sessionService: SessionService,
    private readonly releaseService: ReleaseService,
  ) {}

  @AdminGuard()
  @TypedRoute.Get('/status/:statusType')
  async getReleases(
    @TypedParam('statusType') statusType: TRelease['status'],
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetReleaseListResponse> {
    const releases = await this.db.query.release.findMany({
      where: eq(schema.release.status, statusType),
      with: {
        tracks: { orderBy: asc(schema.track.index) },
        promoLinks: true,
      },
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });

    return { data: releases };
  }

  @TypedRoute.Get('my')
  async getMyReleases(
    @User() user: TUser,
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetReleaseListResponse> {
    const releases = await this.db.query.release.findMany({
      where: eq(schema.release.authorId, user.id),
      with: { tracks: { orderBy: asc(schema.track.index) }, promoLinks: true },
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
        tracks: { orderBy: asc(schema.track.index) },
        promoLinks: true,
      },
    });

    if (!release) throw new BadRequestException('Релиз не найден');

    if (release.authorId !== user.id && !user.isAdmin)
      throw new ForbiddenException('Недостаточно прав для просмотра релиза');

    return { data: release };
  }

  @AdminGuard()
  @TypedRoute.Get('/user/:userId')
  async getUserReleases(
    @TypedParam('userId') userId: string,
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetReleaseListResponse> {
    const releases = await this.db.query.release.findMany({
      where: eq(schema.release.authorId, userId),
      with: { tracks: { orderBy: asc(schema.track.index) }, promoLinks: true },
      limit: params.size,
      offset: (params.page - 1) * params.size,
    });

    return { data: releases };
  }

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

        const authorRightsResult = authorRightsSchema.safeParse(
          currentTrack.author_rights,
        );

        if (!authorRightsResult.success) {
          throw new BadRequestException(
            `Не верный формат прав автора в треке ${0} (${currentTrack.title})`,
          );
        }

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
          text_sync: trackTextSyncPublicUrl ?? null,
          ringtone: trackRingtonePublicUrl ?? null,
          video: trackVideoPublicUrl ?? null,
          video_shot: trackVideoShotPublicUrl ?? null,
        });
      }

      return {
        release: {
          preview: publicReleasePreviewUrl,
        },
        tracks: trackUrls,
      };
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
    @User() user: TUser,
    @TypedParam('releaseId') releaseId: string,
    @TypedBody() body: TUpdateReleaseBody,
  ): Promise<TUpdateReleaseResponse> {
    const { release, tracks } = body;

    return await this.db.transaction(async (tx) => {
      const existingRelease = await tx.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
      });

      if (!existingRelease) throw new BadRequestException('Релиз не найден');

      if (existingRelease.authorId !== user.id)
        throw new ForbiddenException('Недостаточно прав');

      const releasePreviewUrl = existingRelease.preview
        ? await this.releaseService.createPutUrl(
            'previews',
            `${releaseId}.${release.preview}`,
          )
        : '';

      const releaseDate = release.releaseDate
        ? new Date(release.releaseDate)
        : undefined;

      const startDate = release.startDate
        ? new Date(release.startDate)
        : undefined;

      const preorderDate = release.preorderDate
        ? new Date(release.preorderDate)
        : undefined;

      const yandexSoonNewRelease = release.yandexSoonNewRelease
        ? new Date(release.yandexSoonNewRelease)
        : undefined;

      await tx
        .update(schema.release)
        .set({
          ...release,
          releaseDate,
          startDate,
          preorderDate,
          yandexSoonNewRelease,
        })
        .where(eq(schema.release.id, releaseId));

      const trackUrls: TUpdateReleaseResponse['tracks'] = [];

      for (let trackIndex = 0; trackIndex < tracks.length; trackIndex++) {
        const { id: trackId, data: trackData } = tracks[trackIndex];

        const existingTrack = await tx.query.track.findFirst({
          where: and(
            eq(schema.track.id, trackId),
            eq(schema.track.releaseId, releaseId),
          ),
        });

        if (!existingTrack) {
          throw new BadRequestException(
            `Один или несколько треков не найдены в релизе`,
          );
        }

        const authorRightsResult = authorRightsSchema.safeParse(
          trackData.author_rights,
        );

        if (!!trackData.author_rights && !authorRightsResult.success) {
          throw new BadRequestException(
            `Неверные данные в правах автора трека`,
          );
        }

        const instantGratification = trackData.instant_gratification
          ? new Date(trackData.instant_gratification)
          : undefined;

        await tx
          .update(schema.track)
          .set({
            ...trackData,
            instant_gratification: instantGratification,
          })
          .where(eq(schema.track.id, trackId));

        const releaseTrackUrl = trackData.track
          ? await this.releaseService.createPutUrl(
              'tracks',
              `${trackId}.${trackData.track}`,
            )
          : undefined;

        const trackTextSyncUrl = trackData.text_sync
          ? await this.releaseService.createPutUrl(
              'syncs',
              `${trackId}.${trackData.text_sync}`,
            )
          : undefined;

        const trackRingtoneUrl = trackData.ringtone
          ? await this.releaseService.createPutUrl(
              'ringtones',
              `${trackId}.${trackData.ringtone}`,
            )
          : undefined;

        const trackVideoUrl = trackData.video
          ? await this.releaseService.createPutUrl(
              'videos',
              `${trackId}.${trackData.video}`,
            )
          : undefined;

        const trackVideoShotUrl = trackData.video_shot
          ? await this.releaseService.createPutUrl(
              'videoshots',
              `${trackId}.${trackData.video_shot}`,
            )
          : undefined;

        trackUrls.push({
          track: releaseTrackUrl,
          text_sync: trackTextSyncUrl,
          ringtone: trackRingtoneUrl,
          video: trackVideoUrl,
          video_shot: trackVideoShotUrl,
        });
      }

      return {
        release: {
          preview: releasePreviewUrl,
        },
        tracks: trackUrls,
      };
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
  ): Promise<TUpdateReleaseStatusResponse> {
    return await this.db.transaction(async (tx) => {
      const release = await tx.query.release.findFirst({
        where: eq(schema.release.id, releaseId),
        with: {
          author: true,
        },
      });

      if (!release) {
        throw new BadRequestException('Релиз не найден');
      }

      if (body.status === 'approved' && !!body.upc) {
        await tx
          .update(schema.release)
          .set({ upc: body.upc, status: body.status })
          .where(eq(schema.release.id, releaseId));

        return {
          success: true,
          data: {
            title: release.title,
            email: release.author.email,
          },
        };
      }

      if (body.status === 'rejected' && !!body.rejectReason) {
        await tx
          .update(schema.release)
          .set({ rejectReason: body.rejectReason, status: body.status })
          .where(eq(schema.release.id, releaseId));

        if (!release) {
          throw new BadRequestException('Неверные данные');
        }

        return {
          success: true,
          data: {
            title: release.title,
            email: release.author.email,
          },
        };
      }

      if (body.status === 'moderating') {
        await tx
          .update(schema.release)
          .set({ status: body.status })
          .where(eq(schema.release.id, releaseId));

        if (!release) {
          throw new BadRequestException('Неверные данные');
        }

        return {
          success: true,
          data: {
            title: release.title,
            email: release.author.email,
          },
        };
      }

      throw new BadRequestException('Неверные данные');
    });
  }
}
