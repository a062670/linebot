import { Module } from '@nestjs/common';
import { LineService } from './line.service';
import { LineController } from './line.controller';
import { GptModule } from '@shared/gpt/gpt.module';
import { GoogleSearchModule } from '@shared/google-search/google-search.module';
import { EarthquakeModule } from '@shared/earthquake/earthquake.module';

@Module({
  controllers: [LineController],
  providers: [LineService],
  imports: [GptModule, GoogleSearchModule, EarthquakeModule],
})
export class LineModule {}
