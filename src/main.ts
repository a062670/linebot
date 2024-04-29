import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { middleware as LineMiddleware } from './modules/line/config/line-middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use('line/webhook', LineMiddleware);
  await app.listen(80);
}
bootstrap();
