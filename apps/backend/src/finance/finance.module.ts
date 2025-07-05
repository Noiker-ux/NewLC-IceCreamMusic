import { Module } from '@nestjs/common';
import { FinanceRouter } from './finance.router';

@Module({
  providers: [FinanceRouter],
})
export class FincanceModule {}
