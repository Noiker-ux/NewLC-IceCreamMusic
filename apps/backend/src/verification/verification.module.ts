import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [VerificationController],
})
export class VerificationModule {}
