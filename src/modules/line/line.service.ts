import { Injectable } from '@nestjs/common';
import { WebhookEvent } from '@line/bot-sdk';
import { client } from './config/line.config';

@Injectable()
export class LineService {
  async handleEvent(event: WebhookEvent) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return null;
    }

    // const userId = event.source.userId;
    const content = event.message.text;

    const reply = await this.getTestReply(content);

    if (reply) {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [reply],
      });
    }
    return null;
  }

  /** Test */
  async getTestReply(content: string) {
    if (!content.toLocaleLowerCase().startsWith('/test')) {
      return null;
    }
    return {
      type: 'text',
      text: `Test: ${content}`,
    };
  }
}
