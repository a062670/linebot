import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { client, config } from './config/gpt.config';
import { GptChats } from './gpt.interface';

const gptChats = {} as GptChats;

@Injectable()
export class GptService {
  async getReply(prompt: string, key: string) {
    try {
      // 如果 prompt 為 'new'，初始化聊天室
      if (prompt === 'new') {
        gptChats[key] = {
          ...config,
          messages: [],
        };
        return '已初始化您的聊天室';
      }

      // 取出聊天室
      let chat: OpenAI.Chat.ChatCompletionCreateParams = gptChats[key];
      // 如果還沒有聊天室，初始化一個
      if (!chat) {
        chat = {
          ...config,
          messages: [],
        };
        gptChats[key] = chat;
      }

      // 加入新訊息
      chat.messages.push({ role: 'user', content: prompt });

      // 送出訊息，取得回復
      const resp = (await client.chat.completions.create(
        chat,
      )) as OpenAI.Chat.ChatCompletion;

      // 將回復加入聊天室
      chat.messages.push({
        role: 'assistant',
        content: resp.choices[0].message.content,
      });

      // 回傳回復
      return resp.choices[0].message.content;
    } catch (error) {
      return error.message;
    }
  }
}
