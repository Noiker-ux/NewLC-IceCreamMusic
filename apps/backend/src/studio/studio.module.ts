import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StudioController } from './studio.controller';

@Module({
  imports: [AuthModule],
  controllers: [StudioController],
})
export class StudioModule {}
