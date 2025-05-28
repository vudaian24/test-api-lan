const { createServer, proxy } = require('aws-serverless-express');
const express = require('express');
const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../../dist/app.module');
const { ExpressAdapter } = require('@nestjs/platform-express');

const server = express();

let cachedServer;

async function bootstrapServer() {
  if (!cachedServer) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
    await app.init();
    cachedServer = server;
  }
  return cachedServer;
}

module.exports = async (req, res) => {
  const server = await bootstrapServer();
  server(req, res);
};
