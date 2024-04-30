import { Controller } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller()
export class GptController {
  constructor(private readonly gptService: GptService) {}
}
