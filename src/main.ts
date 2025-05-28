import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const ConfigKey = {
  PORT: 'PORT',
  BASE_PATH: 'BASE_PATH',
  SWAGGER_ENABLED: 'SWAGGER_ENABLED',
}
const BooleanString = {
  TRUE: 'true',
  FALSE: 'false',
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  const configService = app.get(ConfigService);
  const whiteList = '*';
  const corsOptions: CorsOptions = {
    origin:
      whiteList?.split(',')?.length > 1
        ? whiteList.split(',')
        : whiteList,
    // origin: true,
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

  app.enableCors(corsOptions);

  // setup prefix of route
  app.setGlobalPrefix(configService.get(ConfigKey.BASE_PATH) ?? '');

  if (configService.get(ConfigKey.SWAGGER_ENABLED) !== BooleanString.TRUE) {
    const config = new DocumentBuilder()
      .addBearerAuth()
      .setTitle('Cybereason MDR Mobile App 2.0 project - Platform API')
      .setDescription(
        'Provides RESTful API to internal & external services',
      )
      .setVersion('v1')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(configService.get(ConfigKey.PORT) || 3000);
}
bootstrap();
