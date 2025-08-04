import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { AuthModule } from '../auth/auth.module';
import { VerificationService } from './verification.service';

@Module({
  imports: [AuthModule],
  controllers: [VerificationController],
  providers: [VerificationService],
})
export class VerificationModule {}
