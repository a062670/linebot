import { FlexMessage } from '@line/bot-sdk';
import {
  sharedFormatHeader,
  sharedFormatHero,
  sharedFormatFooter,
} from './shared.format';

const gptFormat = (userId, prompt, reply): FlexMessage => {
  return {
    type: 'flex',
    altText: 'this is a flex message',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`GPT(${userId.slice(-10)})`),
      hero: sharedFormatHero(prompt),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: reply,
          },
        ],
        paddingAll: 'md',
      },
      footer: sharedFormatFooter(),
    },
  };
};

export { gptFormat };
