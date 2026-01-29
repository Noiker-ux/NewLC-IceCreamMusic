import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.service';

@Module({
  imports: [AuthModule],
  controllers: [ReleaseController],
  providers: [ReleaseService],
  exports: [ReleaseService],
})
export class ReleaseModule {}
