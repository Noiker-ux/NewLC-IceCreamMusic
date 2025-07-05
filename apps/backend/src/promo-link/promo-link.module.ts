import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PromoLinkController } from './promo-link.controller';

@Module({
  imports: [AuthModule],
  controllers: [PromoLinkController],
})
export class PromoLinkModule {}
