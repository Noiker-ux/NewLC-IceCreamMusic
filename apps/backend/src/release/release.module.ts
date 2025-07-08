import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.sercice';

@Module({
  imports: [AuthModule],
  controllers: [ReleaseController],
  providers: [ReleaseService],
})
export class ReleaseModule {}
