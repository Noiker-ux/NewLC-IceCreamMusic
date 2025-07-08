import { TypedBody, TypedParam, TypedQuery, TypedRoute } from '@nestia/core';
import {
  BadRequestException,
  Controller,
  Inject,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { DB, schema } from 'db';
import { eq, InferSelectModel } from 'drizzle-orm';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';
import { Primitive } from 'typia';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { StudioService } from './studio.service';

export type TStudioData = Primitive<InferSelectModel<typeof schema.studios>>;

export type TStudioPhotoData = Primitive<
  InferSelectModel<typeof schema.studioPhotos>
>;

export type TCompleteStudioData = TStudioData & { photos: TStudioPhotoData[] };

export type TGetStudiosResponse = TCompleteStudioData[];

export type TCreateStudioBody = {
  studio: Omit<TStudioData, 'id'>;
  photos: Omit<TStudioPhotoData, 'id' | 'studioId'>[];
};

export type TAddPhotoBody = Omit<TStudioPhotoData, 'id' | 'studioId'>;

export type TCreateStudioResponse = {
  studio: Pick<TStudioData, 'logo' | 'background'>;
  photos: Pick<TStudioPhotoData, 'url'>[];
};

export type TAddPhotoResponse = Pick<TStudioPhotoData, 'url'>;

export type TUpdateStudioBody = {
  data: Partial<Omit<TStudioData, 'id'>>;
};

export type TUpdateStudioResponse = {
  logo: string;
  background: string;
};

@ApiTags('studios')
@Controller('studios')
export class StudioController {
  logger = new Logger(StudioController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    @InjectMinio() private readonly s3Client: Client,
    private readonly studioService: StudioService,
  ) {}

  @TypedRoute.Get()
  async getStudios(
    @TypedQuery() params: TPageQuery,
  ): Promise<TGetStudiosResponse> {
    return this.db.query.studios.findMany({
      limit: params.size,
      offset: (params.page - 1) * params.size,
      with: {
        photos: true,
      },
    });
  }

  @TypedRoute.Get(':studioId')
  async getStudioById(
    @TypedParam('studioId') studioId: string,
  ): Promise<TCompleteStudioData> {
    const studio = await this.db.query.studios.findFirst({
      where: eq(schema.studios.id, studioId),
      with: { photos: true },
    });

    if (!studio) throw new BadRequestException('Студия не найдена');

    return studio;
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Post()
  async createStudio(
    @TypedBody() body: TCreateStudioBody,
  ): Promise<TCreateStudioResponse> {
    const { photos, studio } = body;

    const result = await this.db.transaction(async (tx) => {
      const newStudio = (
        await this.db.insert(schema.studios).values(studio).returning()
      ).at(0);

      if (!newStudio)
        throw new InternalServerErrorException('Ошибка при создании студии');

      const logoPublicUrl = await this.studioService.createPublicUrl(
        'studios',
        `${newStudio.id}.${newStudio.logo}`,
      );

      const backgroundPublicUrl = newStudio.background
        ? await this.studioService.createPublicUrl(
            'studio-backgrounds',
            `${newStudio.id}.${newStudio.background}`,
          )
        : '';

      const photosData = photos.map((p) => ({ ...p, studioId: newStudio.id }));

      const newPhotos = await tx
        .insert(schema.studioPhotos)
        .values(photosData)
        .returning();

      if (newPhotos.length !== photos.length)
        throw new InternalServerErrorException(
          'Ошибка при создании фотографий студии',
        );

      const photoUrls: TCreateStudioResponse['photos'] = [];

      for (const photo of newPhotos) {
        const photoUrl = await this.studioService.createPublicUrl(
          'studio-photos',
          `${photo.id}.${photo.url}`,
        );

        photoUrls.push({ url: photoUrl });
      }

      return {
        photos: photoUrls,
        logo: logoPublicUrl,
        background: backgroundPublicUrl,
      };
    });

    return {
      studio: { logo: result.logo, background: result.background },
      photos: result.photos,
    };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Post(':studioId/photos')
  async addStudioPhoto(
    @TypedParam('studioId') studioId: string,
    @TypedBody() body: TAddPhotoBody,
  ): Promise<TAddPhotoResponse> {
    const result = await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      const newPhoto = (
        await tx
          .insert(schema.studioPhotos)
          .values({ ...body, studioId: studio.id })
          .returning()
      ).at(0);

      if (!newPhoto)
        throw new InternalServerErrorException('Не удалось добавить фото');

      const photoUrl = await this.studioService.createPublicUrl(
        'studio-photos',
        `${newPhoto.id}.${newPhoto.url}`,
      );

      return { url: photoUrl };
    });

    return result;
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Delete(':studioId/photos/:photoId')
  async deleteStudioPhoto(
    @TypedParam('studioId') studioId: string,
    @TypedParam('photoId') photoId: string,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      const photos = await tx
        .delete(schema.studioPhotos)
        .where(eq(schema.studioPhotos.id, photoId))
        .returning();

      if (photos.length !== 1)
        throw new InternalServerErrorException('Ошибка при удалении фото');

      const photo = photos.at(0);

      if (!photo) throw new BadRequestException('Фото не найдено');

      await this.s3Client
        .removeObject('studio-photos', `${photo.id}.${photo.url}`)
        .catch((e) => {
          this.logger.error(e);
          throw new InternalServerErrorException('Что-то пошло не так');
        });
    });

    return { success: true };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Patch(':studioId')
  async updateStudio(
    @TypedBody() body: TUpdateStudioBody,
    @TypedParam('studioId') studioId: string,
  ): Promise<TUpdateStudioResponse> {
    const { data } = body;

    return await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      const noLogoResult = await tx
        .update(schema.studios)
        .set(data)
        .where(eq(schema.studios.id, studioId))
        .returning();

      if (noLogoResult.length !== 1)
        throw new InternalServerErrorException('Ошибка при обновлении студии');

      const logoUrl = data.logo
        ? await this.studioService.createPublicUrl(
            'studios',
            `${studioId}:${data.logo}`,
          )
        : '';

      const backgroundUrl = data.background
        ? await this.studioService.createPublicUrl(
            'studio-backgrounds',
            `${studioId}:${data.background}`,
          )
        : '';

      return { logo: logoUrl, background: backgroundUrl };
    });
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Delete(':studioId')
  async deleteStudio(
    @TypedParam('studioId') studioId: string,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
        with: { photos: true },
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      await this.studioService.deleteAssets(studio.id).catch(() => {
        throw new InternalServerErrorException(
          'Ошибка при удалении ассетов студии',
        );
      });

      const studioResult = await tx
        .delete(schema.studios)
        .where(eq(schema.studios.id, studioId));

      if (studioResult.rowCount !== 1)
        throw new InternalServerErrorException('Ошибка при удалении студии');
    });

    return { success: true };
  }
}
