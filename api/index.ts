import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express from 'express';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

const server = express();
let app: any;

async function createNestServer(expressInstance: any) {
  if (!app) {
    const nestApp = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressInstance),
      {
        logger: ['error', 'warn', 'log'],
        cors: true
      }
    );

    const configService = nestApp.get(ConfigService);
    const swaggerEnabled = configService.get<string>('SWAGGER_ENABLED') === 'true'

    if (swaggerEnabled) {
      // Phục vụ tệp tĩnh của Swagger
      const swaggerAssets = join(
        require.resolve('swagger-ui-dist'),
        '..'
      );
      nestApp.use('/swagger-static', express.static(swaggerAssets));

      // Thiết lập Swagger
      const config = new DocumentBuilder()
        .setTitle('My API')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();

      const document = SwaggerModule.createDocument(nestApp, config);

      nestApp.use('/swagger-json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(document);
      });

      // Thiết lập Swagger UI với đường dẫn tùy chỉnh cho tệp tĩnh
      SwaggerModule.setup('docs', nestApp, document, {
        customCssUrl: '/swagger-static/swagger-ui.css',
        customJs: [
          '/swagger-static/swagger-ui-bundle.js',
          '/swagger-static/swagger-ui-standalone-preset.js'
        ],
        swaggerOptions: {
          persistAuthorization: true,
        },
      });
    }

    await nestApp.init();
    app = nestApp;
  }
  return app;
}

export default async (req: any, res: any) => {
  try {
    await createNestServer(server);
    server(req, res);
  } catch (error) {
    console.error('Error creating Nest server:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};