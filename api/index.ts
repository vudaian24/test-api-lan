import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { ExpressAdapter } from '@nestjs/platform-express';
import express, { Express } from 'express';
import helmet from 'helmet';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const ConfigKey = {
  PORT: 'PORT',
  BASE_PATH: 'BASE_PATH',
  SWAGGER_ENABLED: 'SWAGGER_ENABLED',
};

const BooleanString = {
  TRUE: 'true',
  FALSE: 'false',
};

const expressApp: Express = express();
let nestApp;

async function bootstrap() {
  if (!nestApp) {
    // Tạo Nest app với Express adapter
    nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    // Middleware bảo mật
    nestApp.use(helmet());

    // Lấy config service
    const configService = nestApp.get(ConfigService);

    // Cấu hình CORS
    const whiteList = '*';
    const corsOptions: CorsOptions = {
      origin:
        whiteList?.split(',')?.length > 1
          ? whiteList.split(',')
          : whiteList,
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

    // Thiết lập global prefix
    nestApp.setGlobalPrefix(configService.get(ConfigKey.BASE_PATH) ?? '');

    // Khởi tạo Nest app trước khi dùng Swagger
    await nestApp.init();

    // Nếu bật swagger thì setup swagger
    if (configService.get(ConfigKey.SWAGGER_ENABLED) === BooleanString.TRUE) {
      const swaggerConfig = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Cybereason MDR Mobile App 2.0 project - Platform API')
        .setDescription('Provides RESTful API to internal & external services')
        .setVersion('v1')
        .build();

      const document = SwaggerModule.createDocument(nestApp, swaggerConfig);

      // Dùng đúng adapter instance Express từ NestJS
      SwaggerModule.setup('swagger', nestApp.getHttpAdapter().getInstance(), document);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await bootstrap();
  expressApp(req, res);
}
