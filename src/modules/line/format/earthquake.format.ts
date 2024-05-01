import { FlexMessage } from '@line/bot-sdk';
import {
  sharedFormatHeader,
  sharedFormatFooter,
  sharedFormatNoResult,
} from './shared.format';
import { EarthquakeResult } from '@shared/earthquake/earthquake.service';

const earthquakeFormat = (
  earthquakeResult: EarthquakeResult[],
): FlexMessage => {
  return {
    type: 'flex',
    altText: '地震資訊',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader('地震'),
      body: !earthquakeResult.length
        ? sharedFormatNoResult()
        : {
            type: 'box',
            layout: 'vertical',
            contents: earthquakeResult.map((result) => ({
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'image',
                  url: result.image,
                  size: 'full',
                  aspectRatio: '4:3',
                },
              ],
              paddingAll: 'none',
              action: {
                type: 'uri',
                label: 'action',
                uri: result.link,
              },
            })),
            paddingAll: 'none',
          },
      footer: sharedFormatFooter(),
    },
  };
};

export { earthquakeFormat };
