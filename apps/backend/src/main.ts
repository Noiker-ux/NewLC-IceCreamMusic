import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { NestiaSwaggerComposer } from '@nestia/sdk';
import { SwaggerModule } from '@nestjs/swagger';

const swaggerCDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.7.2';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      json: false,
    }),
  });

  app.enableCors();

  app.setGlobalPrefix('v1');

  if (JSON.parse(process.env.SHOW_API_DOCS ?? 'false')) {
    const document = await NestiaSwaggerComposer.document(app, {
      openapi: '3.1',
      servers: [
        {
          url: 'http://localhost:5000',
          description: 'Localhost',
        },
      ],
      security: {
        bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
        },
      },
    });

    SwaggerModule.setup('api', app, document as any, {
      customCssUrl: [`${swaggerCDN}/swagger-ui.css`],
      customJs: [
        `${swaggerCDN}/swagger-ui-bundle.js`,
        `${swaggerCDN}/swagger-ui-standalone-preset.js`,
      ],
    });
  }

  await app.listen(5000);
}

void bootstrap();
