import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
// 必須寫在上面
const envModule = ConfigModule.forRoot({
  isGlobal: true,
});
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LineModule } from './modules/line/line.module';
import { GptModule } from './shared/gpt/gpt.module';
import { GoogleSearchModule } from './shared/google-search/google-search.module';
import { EarthquakeModule } from './shared/earthquake/earthquake.module';
import { WeatherModule } from './shared/weather/weather.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
      serveStaticOptions: {
        index: false,
      },
    }),
    envModule,
    LineModule,
    GptModule,
    GoogleSearchModule,
    EarthquakeModule,
    WeatherModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
