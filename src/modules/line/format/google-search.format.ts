import { FlexMessage } from '@line/bot-sdk';
import {
  sharedFormatHeader,
  sharedFormatHero,
  sharedFormatFooter,
} from './shared.format';
import { GoogleSearchResult } from '@shared/google-search/google-search.service';

const googleSearchFormat = (
  keyword: string,
  searchResult: GoogleSearchResult[],
): FlexMessage => {
  return {
    type: 'flex',
    altText: 'this is a flex message',
    contents: {
      type: 'bubble',
      header: sharedFormatHeader('Google Search'),
      hero: sharedFormatHero(keyword),
      body: {
        type: 'box',
        layout: 'vertical',
        contents: searchResult.length
          ? searchResult.map((result) => ({
              type: 'box',
              layout: 'vertical',
              contents: [
                {
                  type: 'text',
                  text: result.title,
                  color: '#0066FF',
                },
                {
                  type: 'text',
                  text: result.snippet,
                },
              ],
              action: {
                type: 'uri',
                label: 'action',
                uri: result.link,
              },
              paddingAll: 'md',
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
const googleSearchFormatEmpty = () => {};

export { googleSearchFormat, googleSearchFormatEmpty };
