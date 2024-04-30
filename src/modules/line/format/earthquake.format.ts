import { FlexMessage } from '@line/bot-sdk';
import { sharedFormatHeader, sharedFormatFooter } from './shared.format';
import { EarthquakeResult } from '@shared/earthquake/earthquake.service';

const earthquakeFormat = (
  earthquakeResult: EarthquakeResult[],
): FlexMessage => {
  return {
    type: 'flex',
    altText: 'this is a flex message',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader('地震'),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: earthquakeResult.length
          ? earthquakeResult.map((result) => ({
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
            }))
          : [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: 'No result',
                  },
                ],
                paddingAll: 'md',
              },
            ],
        paddingAll: 'none',
      },
      footer: sharedFormatFooter(),
    },
  };
};

export { earthquakeFormat };
