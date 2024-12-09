import { FlexMessage } from '@line/bot-sdk';
import { sharedFormatHeader, sharedFormatFooter } from './shared.format';

const helpFormat = (): FlexMessage => {
  const list = [
    ['/gpt {msg}', 'chatGPT'],
    ['/google {query}', 'Google Search'],
    ['/地震', '最新地震情報'],
    ['/天氣 or /{縣市}天氣', '天氣情報'],
    ['/image [-furry] [-ref url] {提示詞}', '圖片生成器'],
    ['/userid', '取得自己的 line userId'],
    ['#', '貼圖列表'],
    ['#新增 {name} {url}', '新增貼圖'],
    ['#add {name} {url}', '新增貼圖'],
    ['#{name}', '召喚貼圖'],
    ['!', 'gemini 角色列表'],
    ['!add {name} {描述} {詳細資訊}', '新增 gemini 角色'],
    ['!user {name} {info}', '設定 gemini 使用者資訊 ex: !user 葉紹 男，25歲'],
    ['!new {角色.name}', '建立與指定角色的 gemini 聊天室'],
    ['!{msg}', '開始 gemini 聊天'],
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
          layout: 'vertical',
          contents: [
            {
              type: 'text',
              text: command,
              wrap: true,
            },
            {
              type: 'text',
              text: description,
              wrap: true,
              color: '#999999',
              size: 'sm',
            },
          ],
        })),
        spacing: 'xl',
      },
      footer: sharedFormatFooter(),
    },
  };
};

export { helpFormat };
