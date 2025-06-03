import { Logger, Module, OnModuleInit } from '@nestjs/common';
import * as dbSchema from 'db/schema';
import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TrpcModule } from './trpc/trpc.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TrpcModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DrizzlePGModule.registerAsync({
      tag: 'DB_TAG',
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const user = config.getOrThrow<string>('DB_USER');
        const password = config.getOrThrow<string>('DB_PASSWORD');
        const host = config.getOrThrow<string>('DB_HOST');
        const port = config.getOrThrow<string>('DB_PORT');
        const dbName = config.getOrThrow<string>('DB_NAME');

        return {
          pg: {
            connection: 'pool',
            config: {
              connectionString: `postgres://${user}:${password}@${host}:${port}/${dbName}`,
            },
          },
          config: {
            schema: { ...dbSchema },
          },
        };
      },
    }),
    AuthModule,
    ScheduleModule.forRoot(),
    TaskModule,
  ],
})
export class AppModule implements OnModuleInit {
  logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log(`Server started on http://localhost:5000`);
  }
}
