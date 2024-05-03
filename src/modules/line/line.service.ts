import { Injectable } from '@nestjs/common';
import { WebhookEvent } from '@line/bot-sdk';
import { client } from './config/line.config';

import { GptService } from '@shared/gpt/gpt.service';
import { GoogleSearchService } from '@shared/google-search/google-search.service';
import { EarthquakeService } from '@shared/earthquake/earthquake.service';
import { WeatherService } from '@shared/weather/weather.service';
import { StickerService } from '@shared/sticker/sticker.service';
import { GeminiService } from '@shared/gemini/gemini.service';

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
  geminiFormat,
  geminiFormatText,
  geminiFormatList,
} from './format/gemini.format';
import { helpFormat } from './format/help.format';

@Injectable()
export class LineService {
  constructor(
    private readonly gptService: GptService,
    private readonly googleSearchService: GoogleSearchService,
    private readonly earthquakeService: EarthquakeService,
    private readonly weatherService: WeatherService,
    private readonly stickerService: StickerService,
    private readonly geminiService: GeminiService,
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
      (await this.getGoogleSearchReply(content)) ||
      (await this.getEarthquakeReply(content)) ||
      (await this.getWeatherReply(content)) ||
      (await this.getStickerReply(content)) ||
      (await this.getGeminiReply(content, userId)) ||
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

    // 查詢
    const name = commentList[0];
    const sticker = await this.stickerService.findOne(name);
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
      return geminiFormatText('新聊天室', `成功(${resp.user})(${resp.char})`);
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
      return geminiFormatText('使用者', `更新成功(${userId})`);
    }

    // 查詢
    const prompt = commentList.join(' ');
    const reply = await this.geminiService.getReply(prompt, userId);
    if (reply) {
      return geminiFormat(userId, prompt, reply);
    }
    return null;
  }

  /** Help */
  async getHelpReply(content: string) {
    if (!content.toLocaleLowerCase().startsWith('/help')) {
      return null;
    }
    return helpFormat();
  }
}
