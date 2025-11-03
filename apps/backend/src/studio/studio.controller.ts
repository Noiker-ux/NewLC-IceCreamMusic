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
import { eq, InferInsertModel } from 'drizzle-orm';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';
import { AdminGuard } from '../auth/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { TPageQuery, TSuccessionResponse } from '../shared/types';
import { StudioService } from './studio.service';
import { TrueOmit } from 'shared/types/omit';

export type TStudio = InferInsertModel<typeof schema.studios>;

export type TStudioPhoto = InferInsertModel<typeof schema.studioPhotos>;

export type TStudioTeam = InferInsertModel<typeof schema.studioTeam>;

export type TStudioStat = InferInsertModel<typeof schema.studioStats>;

export type TCompleteStudioData = Required<TStudio> & {
  photos: Required<TStudioPhoto>[];
  team: Required<TStudioTeam>[];
  stats: Required<TStudioStat>[];
};

export type TGetStudiosResponse = TCompleteStudioData[];

export type TCreateStudioBody = {
  studio: Omit<TStudio, 'id'>;
  photos: Omit<TStudioPhoto, 'id' | 'studioId'>[];
  team: Omit<TStudioTeam, 'id' | 'studioId'>[];
  stats: Omit<TStudioStat, 'id' | 'studioId'>[];
};

export type TCreateStudioResponse = {
  studio: Pick<TStudio, 'logo' | 'background'>;
  photos: Pick<TStudioPhoto, 'url'>[];
  team: Pick<TStudioTeam, 'photo'>[];
};

export type TAddPhotoBody = Omit<TStudioPhoto, 'id' | 'studioId'>;

export type TAddPhotoResponse = Pick<TStudioPhoto, 'url'>;

export type TAddStudioEmployeeBody = {
  data: Omit<TStudioTeam, 'id' | 'studioId'>;
};

export type TAddStudioEmployeeResponse = {
  photo: string;
};

export type TUpdateStudioEmployee = {
  data: Partial<TAddStudioEmployeeBody['data']>;
};

export type TAddStudioStatsBody = {
  data: Omit<TStudioStat, 'id' | 'studioId'>;
};

export type TUpdateStudioBody = {
  studio: Partial<TrueOmit<TStudio, 'id'>>;
  photos: Partial<TrueOmit<TStudioPhoto, 'studioId'>>[];
  team: Partial<TrueOmit<TStudioTeam, 'studioId'>>[];
  stats: Partial<TrueOmit<TStudioStat, 'studioId'>>[];
};

export type TUpdateStudioResponse = {
  studio: {
    logo: string;
    background: string;
  };
  photos: { url: string }[];
  team: { photo: string }[];
};

@ApiTags('studios')
@Controller({ version: '1', path: 'studios' })
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
        stats: true,
        team: true,
      },
    });
  }

  @TypedRoute.Get(':studioId')
  async getStudioById(
    @TypedParam('studioId') studioId: string,
  ): Promise<TCompleteStudioData> {
    const studio = await this.db.query.studios.findFirst({
      where: eq(schema.studios.id, studioId),
      with: { photos: true, team: true, stats: true },
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
    const { photos, studio, team, stats } = body;

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

      const employeesData = team.map((e) => ({
        ...e,
        studioId: newStudio.id,
      }));

      const newTeam = await tx
        .insert(schema.studioTeam)
        .values(employeesData)
        .returning();

      if (newTeam.length !== team.length)
        throw new InternalServerErrorException(
          'Ошибка при создании фотографий студии',
        );

      const teamPhotoUrls: TCreateStudioResponse['team'] = [];

      for (const teammate of newTeam) {
        const photoUrl = await this.studioService.createPublicUrl(
          'studio-employees',
          `${teammate.id}.${teammate.photo}`,
        );

        teamPhotoUrls.push({ photo: photoUrl });
      }

      const statsData = stats.map((s) => ({ ...s, studioId: newStudio.id }));

      const newStats = await tx
        .insert(schema.studioStats)
        .values(statsData)
        .returning();

      if (newStats.length !== stats.length) {
        throw new InternalServerErrorException(
          'Ошибка при создании статистики студии',
        );
      }

      return {
        photos: photoUrls,
        logo: logoPublicUrl,
        background: backgroundPublicUrl,
        team: teamPhotoUrls,
      };
    });

    return {
      studio: { logo: result.logo, background: result.background },
      photos: result.photos,
      team: result.team,
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
    return await this.db.transaction(async (tx) => {
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

      const photo = photos.at(0);

      if (photos.length !== 1 || !photo)
        throw new InternalServerErrorException('Ошибка при удалении фото');

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
  @TypedRoute.Post(':studioId/team')
  async addStudioEmployee(
    @TypedParam('studioId') studioId: string,
    @TypedBody() body: TAddStudioEmployeeBody,
  ): Promise<TAddStudioEmployeeResponse> {
    return await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      const newEmployees = await tx
        .insert(schema.studioTeam)
        .values({ ...body.data, studioId: studio.id })
        .returning();

      const employee = newEmployees.at(0);

      if (!employee || newEmployees.length !== 1)
        throw new InternalServerErrorException(
          'Ошибка при добавлении сотрудника',
        );

      const photoUrl = await this.studioService.createPublicUrl(
        'studio-employees',
        `${employee.id}.${employee.photo}`,
      );

      return { photo: photoUrl };
    });
  }

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Delete(':studioId/team/:employeeId')
  async deleteStudioEmployee(
    @TypedParam('studioId') studioId: string,
    @TypedParam('employeeId') employeeId: string,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      const employees = await tx
        .delete(schema.studioTeam)
        .where(eq(schema.studioTeam.id, employeeId))
        .returning();

      const employee = employees.at(0);

      if (employees.length !== 1 || !employee)
        throw new InternalServerErrorException('Ошибка при удалении фото');

      await this.s3Client
        .removeObject('studio-employees', `${employee.id}.${employee.photo}`)
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
  @TypedRoute.Post(':studioId/stats')
  async addStudioStats(
    @TypedParam('studioId') studioId: string,
    @TypedBody() body: TAddStudioStatsBody,
  ): Promise<TSuccessionResponse> {
    const { data } = body;

    await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      const stats = await tx
        .insert(schema.studioStats)
        .values({ ...data, studioId: studio.id })
        .returning();

      if (stats.length !== 1)
        throw new InternalServerErrorException(
          'Ошибка при добавлении статистики',
        );
    });

    return { success: true };
  }

  // @ApiSecurity('bearer')
  // @UseGuards(AuthGuard)
  // @AdminGuard()
  // @TypedRoute.Patch(':studioId/stats/:statId')
  // async updateStudioStats() {}

  @ApiSecurity('bearer')
  @UseGuards(AuthGuard)
  @AdminGuard()
  @TypedRoute.Delete(':studioId/stats/:statId')
  async deleteStudioStats(
    @TypedParam('studioId') studioId: string,
    @TypedParam('statId') statId: string,
  ): Promise<TSuccessionResponse> {
    await this.db.transaction(async (tx) => {
      const studio = await tx.query.studios.findFirst({
        where: eq(schema.studios.id, studioId),
      });

      if (!studio) throw new BadRequestException('Студия не найдена');

      const stats = await tx
        .delete(schema.studioStats)
        .where(eq(schema.studioStats.id, statId))
        .returning();

      if (stats.length !== 1)
        throw new InternalServerErrorException(
          'Ошибка при добавлении статистики',
        );
    });

    return { success: true };
  }

  // @ApiSecurity('bearer')
  // @UseGuards(AuthGuard)
  // @AdminGuard()
  // @TypedRoute.Patch(':studioId')
  // async updateStudio(
  //   @TypedBody() body: TUpdateStudioBody,
  //   @TypedParam('studioId') studioId: string,
  // ): Promise<TUpdateStudioResponse> {
  //   const { studio, stats, team, photos } = body;

  //   return await this.db.transaction(async (tx) => {
  //     const existingStudio = await tx.query.studios.findFirst({
  //       where: eq(schema.studios.id, studioId),
  //     });

  //     if (!existingStudio) throw new BadRequestException('Студия не найдена');

  //     const noLogoResult = await tx
  //       .update(schema.studios)
  //       .set(studio)
  //       .where(eq(schema.studios.id, studioId))
  //       .returning();

  //     if (noLogoResult.length !== 1)
  //       throw new InternalServerErrorException('Ошибка при обновлении студии');

  //     const logoUrl = studio.logo
  //       ? await this.studioService.createPublicUrl(
  //           'studios',
  //           `${studioId}:${studio.logo}`,
  //         )
  //       : '';

  //     const backgroundUrl = studio.background
  //       ? await this.studioService.createPublicUrl(
  //           'studio-backgrounds',
  //           `${studioId}:${studio.background}`,
  //         )
  //       : '';

  //     const statLen = stats.length;

  //     for (let statIndex = 0; statIndex < statLen; statIndex++) {
  //       const stat = stats[statIndex];

  //       const statId = stat.id;

  //       const statName = stat.name;

  //       const statValue = stat.value;

  //       if (!statId && statName && statValue) {
  //         await tx
  //           .insert(schema.studioStats)
  //           .values({ name: statName, studioId: studioId, value: statValue })
  //           .returning();
  //       }
  //     }

  //     return { logo: logoUrl, background: backgroundUrl };
  //   });
  // }

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
