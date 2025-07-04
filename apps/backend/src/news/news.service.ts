import { Injectable } from '@nestjs/common';
import { type Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';

@Injectable()
export class NewsService {
  constructor(@InjectMinio() private readonly s3Client: Client) {}

  async createPreviewPostUrl(fileName: string) {
    return await this.s3Client.presignedPutObject(
      'news-previews',
      fileName,
      60 * 60,
    );
  }

  async deleteObject(fileName: string) {
    await this.s3Client.removeObject('news-previews', fileName);
  }
}
