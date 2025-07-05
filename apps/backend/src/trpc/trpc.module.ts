import { Module } from '@nestjs/common';
import { TRPCModule } from 'nestjs-trpc';
import { TrpcController } from './trpc.controller';
import { TrpcContext } from './trpc.context';
import path from 'path';

@Module({
  imports: [
    TRPCModule.forRoot({
      autoSchemaFile:
        process.env.NODE_ENV !== 'production'
          ? path.join(path.dirname(process.cwd()), 'frontend', 'shared', 'api')
          : undefined,
      context: TrpcContext,
    }),
  ],
  providers: [TrpcContext],
  controllers: [TrpcController],
})
export class TrpcModule {}
