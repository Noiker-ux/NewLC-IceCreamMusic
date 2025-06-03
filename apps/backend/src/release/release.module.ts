import { Module } from '@nestjs/common';
import { ReleaseService } from './release.service';
import { ReleaseRouter } from './release.router';

@Module({
  providers: [ReleaseRouter],
  exports: [ReleaseService],
})
export class ReleaseModule {}
