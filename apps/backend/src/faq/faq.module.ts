import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FAQController } from './faq.controller';

@Module({
  imports: [AuthModule],
  controllers: [FAQController],
})
export class FAQModule {}
