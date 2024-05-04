import { Controller, Post, Body } from '@nestjs/common';
import { GeminiService } from './gemini.service';
import { CreateGeminiCharDto } from './dto/create-gemini.dto';

@Controller('gemini')
export class GeminiController {
  constructor(private readonly geminiService: GeminiService) {}

  @Post('char')
  async createChar(@Body() createGeminiCharDto: CreateGeminiCharDto) {
    if (process.env.npm_lifecycle_event === 'start:dev') {
      return await this.geminiService.createChar(createGeminiCharDto);
    }
    return 'You are not in development mode';
  }
}
