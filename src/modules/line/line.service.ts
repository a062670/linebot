import { Injectable } from '@nestjs/common';
import { WebhookEvent } from '@line/bot-sdk';
import { client } from './config/line.config';

import { GptService } from '@shared/gpt/gpt.service';
import { BraveSearchService } from '@shared/brave-search/brave-search.service';
import { EarthquakeService } from '@shared/earthquake/earthquake.service';
import { WeatherService } from '@shared/weather/weather.service';
import { StickerService } from '@shared/sticker/sticker.service';
import { GeminiService } from '@shared/gemini/gemini.service';
import { ImageGenerationService } from '@shared/image-generation/image-generation.service';
import { MessageService } from '@shared/message/message.service';

import { gptFormat } from './format/gpt.format';
import { googleSearchFormat } from './format/google-search.format';
import { earthquakeFormat } from './format/earthquake.format';
import { weatherFormat } from './format/weather.format';
import {
  stickerFormatText,
  stickerFormatList,
  stickerFormatImage,
} from './format/sticker.format';
import {
  imageGenerationFormat,
  imageGenerationFormatError,
} from './format/image-generation.format';
import {
  geminiFormat,
  geminiFormatText,
  geminiFormatList,
} from './format/gemini.format';
import { helpFormat } from './format/help.format';

@Injectable()
export class LineService {
  constructor(
    private readonly gptService: GptService,
    private readonly braveSearchService: BraveSearchService,
    private readonly earthquakeService: EarthquakeService,
    private readonly weatherService: WeatherService,
    private readonly stickerService: StickerService,
    private readonly geminiService: GeminiService,
    private readonly imageGenerationService: ImageGenerationService,
    private readonly messageService: MessageService,
  ) {}

  async handleEvent(event: WebhookEvent) {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return null;
    }

    const userId = `line-${event.source.userId}`;
    const sourceId = this.getSourceId(event.source);
    const content = event.message.text;

    const reply = await this.getReply(content, userId, sourceId);

    if (reply) {
      return client.replyMessage({
        replyToken: event.replyToken,
        messages: [reply],
      });
    }

    if (!/^[/#!]/.test(content)) {
      await this.messageService.save({
        sourceId,
        userId: event.source.userId || '',
        text: content,
      });
    }
    return null;
  }

  private getSourceId(source: WebhookEvent['source']): string {
    if (source.type === 'group') return `group-${source.groupId}`;
    if (source.type === 'room') return `room-${source.roomId}`;
    return `user-${source.userId}`;
  }

  async getReply(content: string, userId: string, sourceId = '') {
    const reply =
      (await this.getTestReply(content)) ||
      (await this.getGptReply(content, userId)) ||
      (await this.getGoogleSearchReply(content)) ||
      (await this.getEarthquakeReply(content)) ||
      (await this.getWeatherReply(content)) ||
      (await this.getStickerReply(content)) ||
      (await this.getGeminiReply(content, userId)) ||
      (await this.getImageGenerationReply(content)) ||
      (await this.getUserId(content, userId)) ||
      (await this.getSummaryReply(content, sourceId)) ||
      (await this.getHelpReply(content));
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
    if (!prompt) {
      return null;
    }

    const reply = await this.gptService.getReply(prompt, userId);
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
    const searchResult = await this.braveSearchService.searchWeb(query);

    return googleSearchFormat(query, searchResult);
  }

  /** Earthquake */
  async getEarthquakeReply(content: string) {
    if (!content.toLocaleLowerCase().startsWith('/地震')) {
      return null;
    }
    const earthquakeResult = await this.earthquakeService.getEarthquakes();
    return earthquakeFormat(earthquakeResult);
  }

  /** Weather */
  async getWeatherReply(content: string) {
    if (!content.startsWith('/') || !content.endsWith('天氣')) {
      return null;
    }

    // /台南天氣 -> 台南
    const cityName = content.slice(1, -2).trim() || '台北';
    const weatherResult = await this.weatherService.getWeather(cityName);
    return weatherFormat(weatherResult);
  }

  /** Sticker */
  async getStickerReply(content: string) {
    if (!content.startsWith('#')) {
      return null;
    }
    const commentList = content
      .slice(1)
      .trim()
      .split(' ')
      .filter((comment) => !!comment);

    // 列表
    if (!commentList.length) {
      const stickerList = await this.stickerService.findAll();
      return stickerFormatList(stickerList);
    }

    // 新增
    if (
      commentList.length >= 3 &&
      (commentList[0] === '新增' || commentList[0] === 'add')
    ) {
      const name = commentList[1];
      const imageUrl = commentList[2];
      const resp = await this.stickerService.create({ name, imageUrl });
      return stickerFormatText(`新增 ${name}`, resp);
    }

    // 刪除
    if (
      commentList.length >= 2 &&
      ['刪除', 'del', 'delete'].includes(commentList[0])
    ) {
      const name = commentList[1];
      const resp = await this.stickerService.remove(name);
      return stickerFormatText(`刪除 ${name}`, resp.affected ? '成功' : '失敗');
    }

    // 查詢
    const name = commentList[0];
    let sticker = await this.stickerService.findOne(name);
    if (!sticker) {
      sticker = await this.stickerService.findFromImageSearch(name);
    }
    if (!sticker) {
      return stickerFormatText(name, 'No result');
    }
    return stickerFormatImage(sticker);
  }

  /** Gemini */
  async getGeminiReply(content: string, userId: string) {
    if (!content.toLocaleLowerCase().startsWith('!')) {
      return null;
    }

    const commentList = content
      .slice(1)
      .trim()
      .split(' ')
      .filter((comment) => !!comment);

    // 列表
    if (!commentList.length) {
      const charList = await this.geminiService.getCharAll();
      return geminiFormatList(charList);
    }

    // 新聊天室
    if (commentList.length >= 1 && commentList[0] === 'new') {
      const resp = await this.geminiService.newChat(
        commentList[1] || '',
        userId,
      );
      return geminiFormatText(
        '新聊天室',
        `成功(${resp.user})\n\n${resp.char}:\n\n${resp.firstMessage}`,
      );
    }

    // 新增
    if (
      commentList.length >= 4 &&
      (commentList[0] === '新增' || commentList[0] === 'add')
    ) {
      await this.geminiService.createChar({
        name: commentList[1],
        description: commentList[2],
        info: commentList.slice(3).join(' '),
        firstMessage: '',
      });
      return geminiFormatText('新增', `新增成功(${commentList[1]})`);
    }

    // 使用者
    if (
      commentList.length >= 3 &&
      (commentList[0] === '使用者' || commentList[0] === 'user')
    ) {
      await this.geminiService.createUser({
        name: commentList[1],
        info: commentList.slice(2).join(' '),
        userId,
      });
      return geminiFormatText(
        '使用者',
        `更新成功(${userId.slice(-10)})(${commentList[1]})`,
      );
    }

    // 查詢
    const prompt = commentList.join(' ');
    const reply = await this.geminiService.getReply(prompt, userId);
    if (reply) {
      return geminiFormat(userId, prompt, reply.chat.char, reply.text);
    }
    return null;
  }

  /** Image Generation */
  async getImageGenerationReply(content: string) {
    if (!content.toLocaleLowerCase().startsWith('/image')) {
      return null;
    }
    const input = content.slice(7).trim();
    if (!input) {
      return null;
    }

    try {
      // const data = await this.imageGenerationService.generate(input);
      const data = await this.imageGenerationService.generateWithGoogle(input);
      return imageGenerationFormat(input, data.urls);
    } catch (error) {
      return imageGenerationFormatError(input, error.message);
    }
    return null;
  }

  /** User ID */
  async getUserId(content: string, userId: string) {
    if (!content.toLocaleLowerCase().startsWith('/userid')) {
      return null;
    }
    return {
      type: 'text',
      text: `User ID: ${userId.replace('line-', '')}`,
    };
  }

  /** 懶人包 */
  async getSummaryReply(content: string, sourceId: string) {
    if (!content.startsWith('/懶人包')) {
      return null;
    }
    if (!sourceId) {
      return { type: 'text' as const, text: '無法辨識訊息來源' };
    }

    const arg = content.slice(4).trim();
    const requested = parseInt(arg, 10) || 50;
    const n = Math.max(1, Math.min(requested, 100));

    const messages = await this.messageService.findRecent(sourceId, n);
    if (!messages.length) {
      return { type: 'text' as const, text: '沒有可分析的對話紀錄' };
    }

    const transcript = messages
      .map((m) => `${m.userId.slice(-6)}: ${m.text}`)
      .join('\n');

    const summary = await this.geminiService.summarize(transcript);

    return {
      type: 'text' as const,
      text: `懶人包（最近 ${messages.length} 則）：\n\n${summary}`.slice(
        0,
        4900,
      ),
    };
  }

  /** Help */
  async getHelpReply(content: string) {
    if (!content.toLocaleLowerCase().startsWith('/help')) {
      return null;
    }
    return helpFormat();
  }
}
