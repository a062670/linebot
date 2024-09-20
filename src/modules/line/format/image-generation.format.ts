import { FlexMessage } from '@line/bot-sdk';
import {
  sharedFormatHeader,
  sharedFormatHero,
  sharedFormatFooter,
} from './shared.format';

const imageGenerationFormat = (input: string, urls: string[]): FlexMessage => {
  return {
    type: 'flex',
    altText: 'Image generation message',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`Image generation`),
      hero: sharedFormatHero(input),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: urls.map((url) => ({
          type: 'box',
          layout: 'vertical',
          contents: [
            {
              type: 'image',
              url: url,
              size: 'full',
              aspectRatio: '13:19',
              action: {
                type: 'uri',
                label: 'action',
                uri: url,
              },
            },
          ],
          paddingAll: 'none',
        })),
        paddingAll: 'none',
      },
      footer: sharedFormatFooter(),
    },
  };
};

const imageGenerationFormatError = (
  input: string,
  msg: string,
): FlexMessage => {
  return {
    type: 'flex',
    altText: 'Image generation message',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`Image generation`),
      hero: sharedFormatHero(input),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: msg,
            wrap: true,
          },
        ],
        paddingAll: 'md',
      },
      footer: sharedFormatFooter(),
    },
  };
};

export { imageGenerationFormat, imageGenerationFormatError };
