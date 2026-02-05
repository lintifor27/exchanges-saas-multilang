import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';
import pino from 'pino';
import pinoHttp from 'pino-http';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  // Logger
  const logger = pino({ level: 'info' });
  app.use(pinoHttp({ logger }));
  app.use(json({ limit: '1mb' }));
  app.enableCors({ origin: '*' });
  await app.listen(port);
  logger.info(`API listening on port ${port}`);
}
bootstrap();