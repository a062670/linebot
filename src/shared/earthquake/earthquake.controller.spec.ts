import { Test, TestingModule } from '@nestjs/testing';
import { EarthquakeController } from './earthquake.controller';
import { EarthquakeService } from './earthquake.service';

describe('EarthquakeController', () => {
  let controller: EarthquakeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EarthquakeController],
      providers: [EarthquakeService],
    }).compile();

    controller = module.get<EarthquakeController>(EarthquakeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
