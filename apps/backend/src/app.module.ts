import { DrizzlePGModule } from '@knaadh/nestjs-drizzle-pg';
import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dbSchema from 'db/schema';
import { NestMinioModule } from 'nestjs-minio';
import { AnalytickMdule } from './analytics/analytics.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { FAQModule } from './faq/faq.module';
import { FinanceModule } from './finance/finance.module';
import { NewsModule } from './news/news.module';
import { PromoLinkModule } from './promo-link/promo-link.module';
import { ReleaseModule } from './release/release.module';
import { StudioModule } from './studio/studio.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';
import { VerificationModule } from './verification/verification.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    NestMinioModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        const s3Endpoint = config.getOrThrow<string>('S3_HOST');
        const s3AccessKey = config.getOrThrow<string>('S3_ACCESS_KEY');
        const s3SecretKey = config.getOrThrow<string>('S3_SECRET_KEY');

        return {
          endPoint: s3Endpoint,
          // port: 9000,
          useSSL: true,
          accessKey: s3AccessKey,
          secretKey: s3SecretKey,
        };
      },
    }),
    AuthModule,
    AnalytickMdule,
    FAQModule,
    FinanceModule,
    NewsModule,
    VerificationModule,
    PromoLinkModule,
    StudioModule,
    ReleaseModule,
    UserModule,
    TaskModule,
  ],
  controllers: [AppController],
})
export class AppModule implements OnModuleInit {
  logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log(`Server started on http://localhost:5000`);
  }
}
