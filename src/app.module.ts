import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
// 必須寫在上面
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { LineModule } from './modules/line/line.module';
import { GptModule } from './shared/gpt/gpt.module';
import { GoogleSearchModule } from './shared/google-search/google-search.module';
import { EarthquakeModule } from './shared/earthquake/earthquake.module';
import { WeatherModule } from './shared/weather/weather.module';
import { StickerModule } from './shared/sticker/sticker.module';
import { GeminiModule } from './shared/gemini/gemini.module';
import { ImageGenerationModule } from './shared/image-generation/image-generation.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
      serveStaticOptions: {
        index: false,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data/data.db',
      autoLoadEntities: true,
      // 自動同步資料庫架構，正式環境應使用 TypeORM CLI 的遷移(migration)，以避免資料遺失
      synchronize: true,
    }),
    envModule,
    LineModule,
    GptModule,
    GoogleSearchModule,
    EarthquakeModule,
    WeatherModule,
    StickerModule,
    GeminiModule,
    ImageGenerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
