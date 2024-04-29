import { Controller, Post, Body, Get } from '@nestjs/common';
import { LineService } from './line.service';
import { WebhookRequestBody } from '@line/bot-sdk';

@Controller('line')
export class LineController {
  constructor(private readonly lineService: LineService) {}

  @Get()
  helloLineMeow() {
    return '捏口捏口';
  }

  @Post('webhook')
  async webhook(@Body() body: WebhookRequestBody) {
    const result = await Promise.all(
      body.events.map((event) => this.lineService.handleEvent(event)),
    );
    return result;
  }
}
