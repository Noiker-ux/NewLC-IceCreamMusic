import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DB, schema } from 'db';
import { eq } from 'drizzle-orm';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';

@Injectable()
export class StudioService {
  logger = new Logger(StudioService.name);

  constructor(
    @InjectMinio() private readonly s3Client: Client,
    private readonly config: ConfigService,
    @Inject('DB_TAG') private readonly db: DB,
  ) {}

  async createPublicUrl(bucketName: string, fileName: string) {
    const s3UploadUrl = await this.s3Client.presignedPutObject(
      bucketName,
      fileName,
      60 * 60,
    );

    return s3UploadUrl;
  }

  async deleteAssets(studioId: string) {
    const studio = await this.db.query.studios.findFirst({
      where: eq(schema.studios.id, studioId),
      with: { photos: true, team: true },
    });

    if (!studio) return false;

    await this.s3Client.removeObject('studios', `${studioId}.${studio.logo}`);

    await this.s3Client.removeObject(
      'studio-backgrounds',
      `${studioId}.${studio.background}`,
    );

    for (const photo of studio.photos) {
      await this.s3Client.removeObject(
        'studio-photos',
        `${photo.id}.${photo.url}`,
      );
    }

    for (const employee of studio.team) {
      await this.s3Client.removeObject(
        'studio-employees',
        `${employee.id}.${employee.photo}`,
      );
    }

    return true;
  }
}
