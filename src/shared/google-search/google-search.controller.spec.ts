import { Test, TestingModule } from '@nestjs/testing';
import { GoogleSearchController } from './google-search.controller';
import { GoogleSearchService } from './google-search.service';

describe('GoogleSearchController', () => {
  let controller: GoogleSearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoogleSearchController],
      providers: [GoogleSearchService],
    }).compile();

    controller = module.get<GoogleSearchController>(GoogleSearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
