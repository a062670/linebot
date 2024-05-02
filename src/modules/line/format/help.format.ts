import { FlexMessage } from '@line/bot-sdk';
import { sharedFormatHeader, sharedFormatFooter } from './shared.format';

const helpFormat = (): FlexMessage => {
  const list = [
    ['/gpt {msg}', 'chatGPT'],
    ['/google {query}', 'Google Search'],
    ['/地震', '最新地震情報'],
    ['/天氣 or /{縣市}天氣', '天氣情報'],
    ['#', '貼圖列表'],
    ['#新增 {name} {url}', '新增貼圖'],
    ['#add {name} {url}', '新增貼圖'],
    ['#{name}', '召喚貼圖'],
  ];
  return {
    type: 'flex',
    altText: 'Help',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader('Help'),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: list.map(([command, description]) => ({
          type: 'box',
          layout: 'baseline',
          contents: [
            {
              type: 'text',
              text: command,
            },
            {
              type: 'text',
              text: description,
            },
          ],
        })),
        spacing: 'md',
      },
      footer: sharedFormatFooter(),
    },
  };
};

export { helpFormat };
