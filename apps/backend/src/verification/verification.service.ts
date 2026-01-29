import { Inject, Injectable, Logger } from '@nestjs/common';
import { DB, schema } from 'db';
import { eq } from 'drizzle-orm';
import { Client } from 'minio';
import { InjectMinio } from 'nestjs-minio';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    @InjectMinio() private readonly s3Client: Client,
    @Inject('DB_TAG') private readonly db: DB,
  ) {}

  async getPublicUrl(ticketId: string) {
    const ticket = await this.db.query.verification.findFirst({
      where: eq(schema.verification.id, ticketId),
    });

    if (!ticket) return null;

    return await this.s3Client.presignedGetObject(
      'contracts',
      `${ticket.id}.${ticket.contract}`,
      60 * 601,
    );
  }

  async createPublicUrl(fileName: string) {
    return await this.s3Client.presignedPutObject(
      'contracts',
      fileName,
      60 * 60,
    );
  }

  async deleteAssets(ticketId: string) {
    const ticket = await this.db.query.verification.findFirst({
      where: eq(schema.verification.id, ticketId),
    });

    if (!ticket) return false;

    await this.s3Client.removeObject(
      'contracts',
      `${ticketId}.${ticket.contract}`,
    );

    return true;
  }
}
