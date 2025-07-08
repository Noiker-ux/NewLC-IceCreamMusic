import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StudioController } from './studio.controller';
import { StudioService } from './studio.service';

@Module({
  imports: [AuthModule],
  controllers: [StudioController],
  providers: [StudioService],
})
export class StudioModule {}
