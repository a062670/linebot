import { Injectable } from '@nestjs/common';
import { WebhookEvent } from '@line/bot-sdk';
import { client } from './config/line.config';

import { GptService } from '@shared/gpt/gpt.service';
import { GoogleSearchService } from '@shared/google-search/google-search.service';
import gptFormat from './format/gpt.format';
import { googleSearchFormat } from './format/google-search.format';

@Injectable()
export class LineService {
  constructor(
    private readonly gptService: GptService,
    private readonly googleSearchService: GoogleSearchService,
  ) {}

  async handleEvent(event: WebhookEvent) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return null;
    }

    const userId = event.source.userId;
    const content = event.message.text;

    const reply = await this.getReply(content, userId);

    if (reply) {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [reply],
      });
    }
    return null;
  }

  async getReply(content: string, userId: string) {
    const reply =
      (await this.getTestReply(content)) ||
      (await this.getGptReply(content, userId)) ||
      (await this.getGoogleSearchReply(content));
    return reply;
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

  /** GPT */
  async getGptReply(content: string, userId: string) {
    const contentLower = content.toLowerCase();
    if (!contentLower.startsWith('/gpt')) {
      return null;
    }
    const prompt = content.slice(4).trim();

    const reply = await this.gptService.getReply(prompt, `line-${userId}`);
    if (reply) {
      return gptFormat(userId, prompt, reply);
    }
    return null;
  }

  /** Google Search */
  async getGoogleSearchReply(content: string) {
    if (!content.toLocaleLowerCase().startsWith('/google')) {
      return null;
    }
    const query = content.slice(7).trim();
    const searchResult = await this.googleSearchService.search(query);

    return googleSearchFormat(query, searchResult);
  }
}
