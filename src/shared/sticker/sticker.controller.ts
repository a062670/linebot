import { Controller } from '@nestjs/common';
import { StickerService } from './sticker.service';

@Controller('sticker')
export class StickerController {
  constructor(private readonly stickerService: StickerService) {}
}
