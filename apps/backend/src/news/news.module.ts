import { Module } from '@nestjs/common';
import { NewsRouter } from './news.router';

@Module({
  providers: [NewsRouter],
})
export class NewsModule {}
