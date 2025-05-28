import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const expressApp: Express = express();
let nestApp;

async function bootstrap() {
  if (!nestApp) {
    nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    nestApp.use(helmet());

    const configService = nestApp.get(ConfigService);

    const corsOptions: CorsOptions = {
      origin: '*',
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Language',
        'X-Timezone',
        'X-Timezone-Name',
        'X-Mssp-Id',
        'X-Organization-Id',
      ],
      optionsSuccessStatus: 200,
      methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    };
    nestApp.enableCors(corsOptions);

    nestApp.setGlobalPrefix(configService.get('BASE_PATH') ?? '');

    // Đây là bước cực kỳ quan trọng: init app trước khi dùng swagger
    await nestApp.init();

    if (configService.get('SWAGGER_ENABLED') === 'true') {
      const swaggerConfig = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('API Documentation')
        .setDescription('API description')
        .setVersion('1.0')
        .build();

      const document = SwaggerModule.createDocument(nestApp, swaggerConfig);

      // Lấy instance express app đúng cách từ adapter
      SwaggerModule.setup('swagger', nestApp.getHttpAdapter().getInstance(), document);
    }
  }
}

export default async function handler(req, res) {
  await bootstrap();
  expressApp(req, res);
}
