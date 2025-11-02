import { Injectable, Logger } from '@nestjs/common';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';

@Injectable()
export class AnalyticsService {
  logger = new Logger(AnalyticsService.name);

  constructor(@InjectMinio() private readonly s3Client: Client) {}

  async createPutUrl(fileName: string) {
    return await this.s3Client.presignedPutObject(
      'analytics',
      fileName,
      60 * 60,
    );
  }

  async removeAnalyticsReport(fileName: string) {
    const result = await this.s3Client
      .removeObject('analytics', fileName)
      .then(() => true)
      .catch(() => false);

    return result;
  }
}
