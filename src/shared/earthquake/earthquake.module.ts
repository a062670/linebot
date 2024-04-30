import { Module } from '@nestjs/common';
import { EarthquakeService } from './earthquake.service';
import { EarthquakeController } from './earthquake.controller';

@Module({
  controllers: [EarthquakeController],
  providers: [EarthquakeService],
  exports: [EarthquakeService],
})
export class EarthquakeModule {}
