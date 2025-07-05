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
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { SessionService } from '../auth/session.service';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

export type TStudioData = InferSelectModel<typeof schema.studios>;

export type TStudioPhotoData = InferSelectModel<typeof schema.studioPhotos>;

export type TCompleteStudioData = TStudioData & { photos: TStudioPhotoData[] };

export type TGetStudiosResponse = TCompleteStudioData[];

export type TCreateStudioBody = {
  studio: Omit<TStudioData, 'id'>;
  photos: Omit<TStudioPhotoData, 'id' | 'studioId'>[];
};

export type TAddPhotoBody = Omit<TStudioPhotoData, 'id' | 'studioId'>;

export type TCreateStudioResponse = {
  studio: Pick<TStudioData, 'logo'>;
  photos: Pick<TStudioPhotoData, 'url'>[];
};

export type TAddPhotoResponse = Pick<TStudioPhotoData, 'url'>;

export type TUpdateStudioBody = {
  data: Partial<Omit<TStudioData, 'id'>>;
};

export type TUpdateStudioResponse = {
  logo: string;
};

@ApiTags('studios')
@Controller('studios')
export class StudioController {
  logger = new Logger(StudioController.name);

  constructor(
    @Inject('DB_TAG') private readonly db: DB,
    @InjectMinio() private readonly s3Client: Client,
    private readonly sessionService: SessionService,
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

    const publicUrl = new URL(process.env.NEXT_PUBLIC_S3_URL!);

    const result = await this.db.transaction(async (tx) => {
      const newStudio = (
        await this.db.insert(schema.studios).values(studio).returning()
      ).at(0);

      if (!newStudio)
        throw new InternalServerErrorException('Ошибка при создании студии');

      const studioLogoUrl = await this.s3Client.presignedPutObject(
        'studios',
        `${newStudio.id}:${newStudio.logo}`,
        60 * 60,
      );

      const logoUrl = new URL(studioLogoUrl);

      logoUrl.host = publicUrl.host;

      logoUrl.protocol = publicUrl.protocol;

      logoUrl.port = '';

      const publicLogoUrl = new URL(logoUrl);

      publicLogoUrl.search = '';

      const logoUpdateResult = await tx
        .update(schema.studios)
        .set({ logo: publicLogoUrl.href });

      if (logoUpdateResult.rowCount !== 1)
        throw new InternalServerErrorException('Не удалось обновить логотип');

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
        const photoUrl = await this.s3Client.presignedPutObject(
          'studio-photos',
          `${photo.id}.${photo.url}`,
          60 * 60,
        );

        const dbUrl = new URL(photoUrl);

        dbUrl.host = publicUrl.host;

        dbUrl.protocol = publicUrl.protocol;

        dbUrl.port = '';

        photoUrls.push({ url: dbUrl.href });

        dbUrl.search = '';

        await tx
          .update(schema.studioPhotos)
          .set({
            url: dbUrl.href,
          })
          .where(eq(schema.studioPhotos.id, photo.id));
      }

      return { photos: photoUrls, logo: logoUrl.href };
    });

    return {
      studio: { logo: result.logo },
      photos: result.photos,
    };
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Post(':studioId/photo')
  async addStudioPhoto(
    @TypedParam('studioId') studioId: string,
    @TypedBody() body: TAddPhotoBody,
  ): Promise<TAddPhotoResponse> {
    const publicUrl = new URL(process.env.NEXT_PUBLIC_S3_URL!);

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

      const photoUrl = await this.s3Client.presignedPutObject(
        'studio-photos',
        `${newPhoto.id}.${newPhoto.url}`,
        60 * 60,
      );

      const publicPutUrl = new URL(photoUrl);

      publicPutUrl.protocol = publicUrl.protocol;

      publicPutUrl.host = publicUrl.host;

      publicPutUrl.port = '';

      const publicGetUrl = new URL(publicPutUrl);

      publicGetUrl.search = '';

      const updatedPhoto = await tx
        .update(schema.studioPhotos)
        .set({ url: publicGetUrl.href })
        .where(eq(schema.studioPhotos.id, newPhoto.id))
        .returning();

      if (updatedPhoto.length !== 1)
        throw new InternalServerErrorException(
          'Не удалось обновить ссылку на фото',
        );

      return { url: updatedPhoto[0].url };
    });

    return result;
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Delete(':studioId/photo/:photoId')
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
    const publicUrl = new URL(process.env.NEXT_PUBLIC_S3_URL!);

    const result = await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      if (!body.data.logo) {
        const noLogoResult = await tx
          .update(schema.studios)
          .set(body.data)
          .where(eq(schema.studios.id, studioId))
          .returning();

        if (noLogoResult.length !== 1)
          throw new InternalServerErrorException(
            'Ошибка при обновлении студии',
          );

        return { logo: '' };
      }

      const privateLogoUrl = await this.s3Client.presignedPutObject(
        'studios',
        `${studioId}:${body.data.logo}`,
        60 * 60,
      );

      const publicLogoPutUrl = new URL(privateLogoUrl);

      publicLogoPutUrl.protocol = publicUrl.protocol;

      publicLogoPutUrl.host = publicUrl.host;

      publicLogoPutUrl.port = '';

      const logoPutUrl = publicLogoPutUrl.href;

      const publicLogoGetUrl = new URL(publicLogoPutUrl);

      publicLogoGetUrl.search = '';

      const logoGetUrl = publicLogoGetUrl.href;

      const logoResult = await tx
        .update(schema.studios)
        .set({ ...body, logo: logoGetUrl })
        .where(eq(schema.studios.id, studioId))
        .returning();

      if (logoResult.length !== 1)
        throw new InternalServerErrorException('Ошибка при обновлении студии');

      return { logo: logoPutUrl };
    });

    return result;
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

      for (const photo of studio.photos) {
        const photoResult = await tx
          .delete(schema.studioPhotos)
          .where(eq(schema.studioPhotos.id, photo.id));

        if (photoResult.rowCount !== 1)
          throw new InternalServerErrorException('Ошибка при удалении фото');

        await this.s3Client
          .removeObject('studio-photos', photo.url)
          .catch((e) => {
            this.logger.error(e);
            throw new InternalServerErrorException(
              'Ошибка при удалении файла фото',
            );
          });
      }

      const studioResult = await tx
        .delete(schema.studios)
        .where(eq(schema.studios.id, studioId));

      if (studioResult.rowCount !== 1)
        throw new InternalServerErrorException('Ошибка при удалении студии');

      await this.s3Client.removeObject('studios', studio.logo).catch((e) => {
        this.logger.error(e);
        throw new InternalServerErrorException('Ошибка при удалении логотипа');
      });
    });

    return { success: true };
  }
}
