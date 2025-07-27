import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReleaseController } from './release.controller';

@Module({
  imports: [AuthModule],
  controllers: [ReleaseController],
})
export class ReleaseModule {}
