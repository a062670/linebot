import { Test, TestingModule } from '@nestjs/testing';
import { StickerController } from './sticker.controller';
import { StickerService } from './sticker.service';

describe('StickerController', () => {
  let controller: StickerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StickerController],
      providers: [StickerService],
    }).compile();

    controller = module.get<StickerController>(StickerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
