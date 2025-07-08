import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';

@Injectable()
export class AnalyticsService {
  logger = new Logger(AnalyticsService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectMinio() private readonly s3Client: Client,
  ) {}

  async createPutUrl(fileName: string) {
    const s3PublicUrl = new URL(this.config.getOrThrow('NEXT_PUBLIC_S3_URL'));

    const privateUrl = await this.s3Client.presignedPutObject(
      'analytics',
      fileName,
      60 * 60,
    );

    const publicUrl = new URL(privateUrl);

    publicUrl.hostname = s3PublicUrl.hostname;

    publicUrl.port = '';

    publicUrl.protocol = s3PublicUrl.protocol;

    return publicUrl.toString();
  }

  async removeAnalyticsReport(fileName: string) {
    const result = await this.s3Client
      .removeObject('analytics', fileName)
      .then(() => true)
      .catch(() => false);

    return result;
  }
}
