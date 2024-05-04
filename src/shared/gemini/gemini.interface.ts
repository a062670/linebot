import { ChatSession } from '@google/generative-ai';
/** 聊天室列表，一個使用者一個聊天室 */
export type GeminiChats = {
  [key: string]: GeminiChat;
};

/** 聊天室 */
export type GeminiChat = {
  user: string;
  userInfo: string;
  char: string;
  charInfo: string;
  firstMessage: string;
  chatSession: ChatSession;
};
