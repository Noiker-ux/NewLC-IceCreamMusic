import { Module } from '@nestjs/common';
import { SmartLinkRouter } from './smart-link.router';

@Module({
  providers: [SmartLinkRouter],
})
export class SmartLinkModule {}
