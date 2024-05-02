import { Controller, Get } from '@nestjs/common';
import { StickerService } from './sticker.service';

@Controller('sticker')
export class StickerController {
  constructor(private readonly stickerService: StickerService) {}

  @Get()
  getStickers() {
    return this.stickerService.findAll();
  }
}
