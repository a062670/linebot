import OpenAI from 'openai';
/** 聊天室列表，一個使用者一個聊天室 */
export type GptChats = {
  [key: string]: OpenAI.Chat.ChatCompletionCreateParams;
};
