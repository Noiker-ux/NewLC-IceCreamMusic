import { Module } from '@nestjs/common';
import { AuthRouter } from './auth.router';
@Module({
  providers: [AuthRouter],
})
export class AuthModule {}
