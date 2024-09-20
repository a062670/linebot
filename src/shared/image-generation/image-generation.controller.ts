import { Controller } from '@nestjs/common';
import { ImageGenerationService } from './image-generation.service';

@Controller()
export class ImageGenerationController {
  constructor(
    private readonly imageGenerationService: ImageGenerationService,
  ) {}
}
