import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverlessExpress from '@vendia/serverless-express';

let cachedServer;

export default async function (req, res) {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
    cachedServer = serverlessExpress({ app: nestApp.getHttpAdapter().getInstance() });
  }
  return cachedServer(req, res);
}