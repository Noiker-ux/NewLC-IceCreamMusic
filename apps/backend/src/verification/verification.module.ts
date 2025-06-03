import { Module } from '@nestjs/common';
import { VerificationRouter } from './verification.router';

@Module({
  providers: [VerificationRouter],
})
export class VerificationModule {}
