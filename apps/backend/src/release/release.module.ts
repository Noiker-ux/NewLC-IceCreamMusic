import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ReleaseController } from './release.controller';
import { ReleaseService } from './release.sercice';
import { FinanceModule } from '../finance/finance.module';

@Module({
  imports: [AuthModule, FinanceModule],
  controllers: [ReleaseController],
  providers: [ReleaseService],
})
export class ReleaseModule {}
