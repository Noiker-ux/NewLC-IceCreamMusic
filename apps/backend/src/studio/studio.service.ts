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
    const s3PublicUrl = new URL(this.config.getOrThrow('NEXT_PUBLIC_S3_URL'));

    const privateUrl = await this.s3Client.presignedPutObject(
      bucketName,
      fileName,
      60 * 60,
    );

    const publicUrl = new URL(privateUrl);

    publicUrl.hostname = s3PublicUrl.hostname;

    publicUrl.port = '';

    publicUrl.protocol = s3PublicUrl.protocol;

    return publicUrl.toString();
  }

  async deleteAssets(studioId: string) {
    const studio = await this.db.query.studios.findFirst({
      where: eq(schema.studios.id, studioId),
      with: { photos: true },
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

    return true;
  }
}
