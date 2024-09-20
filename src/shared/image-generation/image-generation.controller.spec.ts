import { Test, TestingModule } from '@nestjs/testing';
import { ImageGenerationController } from './image-generation.controller';
import { ImageGenerationService } from './image-generation.service';

describe('ImageGenerationController', () => {
  let controller: ImageGenerationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImageGenerationController],
      providers: [ImageGenerationService],
    }).compile();

    controller = module.get<ImageGenerationController>(
      ImageGenerationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
