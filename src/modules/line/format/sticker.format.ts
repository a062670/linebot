import { FlexMessage, ImageMessage } from '@line/bot-sdk';
import { sharedFormatHeader, sharedFormatFooter } from './shared.format';
import { Sticker } from '@shared/sticker/sticker.service';

const stickerFormatText = (title: string, message: string): FlexMessage => {
  return {
    type: 'flex',
    altText: `貼圖(${title})`,
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`貼圖(${title})`),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: message,
          },
        ],
        paddingAll: 'md',
      },
      footer: sharedFormatFooter(),
    },
  };
};

const stickerFormatList = (items: Sticker[]): FlexMessage => {
  return {
    type: 'flex',
    altText: '貼圖',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader('貼圖列表'),
      hero: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'button',
            action: {
              type: 'uri',
              label: '預覽',
              uri: `${process.env.WEBSITE_URL}/public/stickers.html`,
            },
            style: 'primary',
            height: 'sm',
          },
        ],
        paddingAll: 'xxl',
        paddingBottom: 'none',
      },
      body: {
        type: 'box',
        layout: 'vertical',
        contents: items.map((item) => ({
          type: 'button',
          action: {
            type: 'message',
            label: item.name,
            text: `#${item.name}`,
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

const stickerFormatImage = (item: Sticker): FlexMessage | ImageMessage => {
  if (!item.animated || !item.width || !item.height) {
    return {
      type: 'image',
      originalContentUrl: item.imageUrl,
      previewImageUrl: item.imageUrl,
    } as ImageMessage;
  }
  return {
    type: 'flex',
    altText: '貼圖',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`貼圖(${item.name})`),
      hero: {
        type: 'image',
        url: item.imageUrl,
        size: 'full',
        aspectMode: 'fit',
        animated: item.animated,
        aspectRatio: `${item.width}:${item.height}`,
        action: {
          type: 'uri',
          uri: item.imageUrl,
          label: 'open image',
        },
      },
      footer: sharedFormatFooter(),
    },
  };
};

export { stickerFormatText, stickerFormatList, stickerFormatImage };
