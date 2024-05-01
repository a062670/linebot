import { FlexBox } from '@line/bot-sdk';

const sharedFormatHeader = (title: string): FlexBox => {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: title,
        color: '#FFFFFF',
        align: 'center',
      },
    ],
    paddingAll: 'xs',
    backgroundColor: '#006600',
  };
};

const sharedFormatHero = (text: string): FlexBox => {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: text,
        color: '#AA3300',
      },
    ],
    paddingAll: 'md',
  };
};

const sharedFormatFooter = (): FlexBox => {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: (process.env.GIT_COMMIT || '0000000').slice(0, 7),
        color: '#999999',
        align: 'center',
      },
    ],
    backgroundColor: '#BBFFBB',
    paddingAll: 'xs',
  };
};

const sharedFormatNoResult = (): FlexBox => {
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: 'No result',
      },
    ],
    paddingAll: 'md',
  };
};

export {
  sharedFormatHeader,
  sharedFormatHero,
  sharedFormatFooter,
  sharedFormatNoResult,
};
