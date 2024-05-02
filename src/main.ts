import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { middleware as LineMiddleware } from './modules/line/config/line.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('line/webhook', LineMiddleware);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(80);
}
bootstrap();
