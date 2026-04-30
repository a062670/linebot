import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { LineService } from './line.service';
import { WebhookRequestBody, HTTPFetchError } from '@line/bot-sdk';

@Controller('line')
export class LineController {
  private readonly logger = new Logger(LineController.name);

  constructor(private readonly lineService: LineService) {}

  @Get()
  helloLineMeow() {
    return '捏口捏口';
  }

  @Post('webhook')
  async webhook(@Body() body: WebhookRequestBody) {
    try {
      const result = await Promise.all(
        body.events.map((event) => this.lineService.handleEvent(event)),
      );
      return result;
    } catch (err) {
      if (err instanceof HTTPFetchError) {
        this.logger.error(
          `LINE API ${err.status} ${err.statusText}: ${err.body}`,
        );
      }
      throw err;
    }
  }

  @Post('test')
  async test(@Body('message') message: string) {
    if (process.env.npm_lifecycle_event === 'start:dev') {
      return await this.lineService.getReply(message, '000');
    }
    return 'You are not in development mode';
  }
}
