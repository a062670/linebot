import { Controller } from '@nestjs/common';
import { EarthquakeService } from './earthquake.service';

@Controller()
export class EarthquakeController {
  constructor(private readonly earthquakeService: EarthquakeService) {}
}
