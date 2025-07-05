import { Module } from '@nestjs/common';
import { FAQRouter } from './faq.router';

@Module({
  providers: [FAQRouter],
})
export class FAQModule {}
