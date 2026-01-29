import { Inject, Injectable, Logger } from '@nestjs/common';
import { DB, schema } from 'db';
import { eq } from 'drizzle-orm';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';

@Injectable()
export class ReleaseService {
  logger = new Logger(ReleaseService.name);

  constructor(
    @InjectMinio() private readonly s3Client: Client,
    @Inject('DB_TAG') private readonly db: DB,
  ) {}

  async createPutUrl(bucketName: string, fileName: string) {
    const s3UploadUrl = await this.s3Client.presignedPutObject(
      bucketName,
      fileName,
      60 * 60,
    );

    return s3UploadUrl;
  }

  async deleteReleaseAssets(releaseId: string) {
    const release = await this.db.query.release.findFirst({
      where: eq(schema.release.id, releaseId),
      with: { tracks: true },
    });

    if (!release) return false;

    await this.s3Client.removeObject(
      'previews',
      `${releaseId}.${release.preview}`,
    );

    for (const track of release.tracks) {
      await this.s3Client.removeObject('tracks', `${track.id}.${track.track}`);
      if (track.ringtone)
        await this.s3Client.removeObject(
          'ringtones',
          `${track.id}.${track.ringtone}`,
        );

      if (track.text_sync)
        await this.s3Client.removeObject(
          'syncs',
          `${track.id}.${track.text_sync}`,
        );

      if (track.video)
        await this.s3Client.removeObject(
          'videos',
          `${track.id}.${track.video}`,
        );

      if (track.video_shot)
        await this.s3Client.removeObject(
          'videoshots',
          `${track.id}.${track.video_shot}`,
        );
    }

    return true;
  }
}
