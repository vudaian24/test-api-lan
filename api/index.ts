// api/index.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import serverlessExpress from '@vendia/serverless-express'; // Đảm bảo bạn đang dùng @vendia/serverless-express, không phải @codegenie/serverless-express

let cachedServer;

// Hàm handler được export mặc định cho Vercel
export default async function (req, res) {
  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);
    await nestApp.init();
    cachedServer = serverlessExpress({ app: nestApp.getHttpAdapter().getInstance() });
  }

  // Gọi hàm handler đã được tạo, truyền vào req, res của Vercel
  // serverlessExpress sẽ tự động chuyển đổi req, res của Vercel thành event, context, callback
  return cachedServer(req, res);
}