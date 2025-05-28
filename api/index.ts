import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import express from 'express';

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
    
    // Thiết lập Swagger
    const config = new DocumentBuilder()
      .setTitle('My API')
      .setDescription('API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    
    const document = SwaggerModule.createDocument(nestApp, config);
    
    // Thiết lập Swagger UI với options tùy chỉnh
    SwaggerModule.setup('swagger', nestApp, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
      customSiteTitle: 'My API Docs',
    });
    
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