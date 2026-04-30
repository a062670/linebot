import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { GptModule } from '@shared/gpt/gpt.module';
import { BraveSearchModule } from '@shared/brave-search/brave-search.module';
import { EarthquakeModule } from '@shared/earthquake/earthquake.module';
import { WeatherModule } from '@shared/weather/weather.module';
import { StickerModule } from '@shared/sticker/sticker.module';
import { GeminiModule } from '@shared/gemini/gemini.module';
import { ImageGenerationModule } from '@shared/image-generation/image-generation.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [
    GptModule,
    BraveSearchModule,
    EarthquakeModule,
    WeatherModule,
    StickerModule,
    GeminiModule,
    ImageGenerationModule,
  ],
})
export class LineModule {}
