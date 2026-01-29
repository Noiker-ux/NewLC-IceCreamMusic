import { Inject, Injectable } from '@nestjs/common';
import { type DB, schema } from 'db';
import { eq } from 'drizzle-orm';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';

@Injectable()
export class UserService {
  constructor(
    @InjectMinio() private readonly s3Client: Client,
    @Inject('DB_TAG') private readonly db: DB,
  ) {}

  async createPublicUrl(fileName: string) {
    const s3UploadUrl = await this.s3Client.presignedPutObject(
      'avatars',
      fileName,
      60 * 60,
    );

    return s3UploadUrl;
  }

  async deleteAssets(userId: string) {
    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.id, userId),
    });

    if (!user) return false;

    if (!user.avatar) return true;

    await this.s3Client.removeObject('avatars', `${userId}.${user.avatar}`);

    return true;
  }
}
