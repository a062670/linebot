import { FlexMessage } from '@line/bot-sdk';
import {
  sharedFormatHeader,
  sharedFormatHero,
  sharedFormatFooter,
} from './shared.format';
import { GeminiChar } from '@shared/gemini/entities/gemini.entity';

const geminiFormat = (
  userId: string,
  prompt: string,
  char: string,
  reply: string,
): FlexMessage => {
  return {
    type: 'flex',
    altText: 'this is a flex message',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`GEMINI(${userId.slice(-10)})`),
      hero: sharedFormatHero(prompt),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `${char}:\n\n${reply}`,
            wrap: true,
          },
        ],
        paddingAll: 'md',
      },
      footer: sharedFormatFooter(),
    },
  };
};

const geminiFormatText = (title: string, message: string): FlexMessage => {
  return {
    type: 'flex',
    altText: `GEMINI(${title})`,
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`GEMINI(${title})`),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: message,
            wrap: true,
          },
        ],
        paddingAll: 'md',
      },
      footer: sharedFormatFooter(),
    },
  };
};

const geminiFormatList = (items: GeminiChar[]): FlexMessage => {
  return {
    type: 'flex',
    altText: 'GEMINI角色列表',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader('GEMINI角色列表'),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: items.map((item) => ({
          type: 'button',
          action: {
            type: 'message',
            label: `${item.name} - ${item.description}`,
            text: `!new ${item.name}`,
          },
          margin: 'xs',
          height: 'sm',
          style: 'secondary',
        })),
      },
      footer: sharedFormatFooter(),
    },
  };
};

export { geminiFormat, geminiFormatText, geminiFormatList };
