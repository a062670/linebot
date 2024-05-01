import * as moment from 'moment';
import { FlexMessage, FlexBox } from '@line/bot-sdk';
import {
  sharedFormatHeader,
  sharedFormatFooter,
  sharedFormatNoResult,
} from './shared.format';
import { WeatherResult } from '@shared/weather/weather.interface';

const weatherFormat = (weatherResult: WeatherResult | null): FlexMessage => {
  return {
    type: 'flex',
    altText: `天氣(${weatherResult.cityName})`,
    contents: {
      type: 'bubble',
      header: sharedFormatHeader(`天氣(${weatherResult.cityName})`),
      body: !weatherResult
        ? sharedFormatNoResult()
        : weatherFormatBody(weatherResult),
      footer: sharedFormatFooter(),
    },
  };
};

const weatherFormatBody = (weatherResult: WeatherResult): FlexBox => {
  const data = moment().utcOffset('+08:00');
  return {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${weatherResult.temp} 度`,
                    size: 'xl',
                    weight: 'bold',
                    align: 'center',
                  },
                  {
                    type: 'text',
                    text: '現在溫度',
                    size: 'xs',
                    align: 'center',
                  },
                ],
                borderWidth: 'light',
                borderColor: '#99CC99',
                cornerRadius: 'md',
                justifyContent: 'center',
                paddingAll: 'md',
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${weatherResult.feels_like} 度`,
                    size: 'xl',
                    weight: 'bold',
                    align: 'center',
                  },
                  {
                    type: 'text',
                    text: '體感溫度',
                    size: 'xs',
                    align: 'center',
                  },
                ],
                borderWidth: 'light',
                borderColor: '#99CC99',
                cornerRadius: 'md',
                justifyContent: 'center',
                paddingAll: 'md',
              },
            ],
            justifyContent: 'center',
            spacing: 'md',
          },
          {
            type: 'box',
            layout: 'vertical',
            contents: [
              {
                type: 'image',
                url: `${process.env.WEBSITE_URL}/public/weather-icon/${weatherResult.icon}@2x.png`,
                size: 'full',
                aspectRatio: '4:3',
              },
              {
                type: 'text',
                text: weatherResult.description,
                align: 'center',
                weight: 'bold',
              },
            ],
          },
        ],
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            text: `(${weatherResult.temp_min} ~ ${weatherResult.temp_max} 度)`,
            align: 'center',
            size: 'xs',
          },
        ],
      },
      {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${weatherResult.pressure} mb`,
                    size: 'xl',
                    weight: 'bold',
                    align: 'center',
                  },
                  {
                    type: 'text',
                    text: '大氣壓力',
                    size: 'xs',
                    align: 'center',
                  },
                ],
                borderWidth: 'light',
                borderColor: '#99CC99',
                cornerRadius: 'md',
                justifyContent: 'center',
                paddingAll: 'md',
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${weatherResult.humidity}%`,
                    size: 'xl',
                    weight: 'bold',
                    align: 'center',
                  },
                  {
                    type: 'text',
                    text: '相對溼度',
                    size: 'xs',
                    align: 'center',
                  },
                ],
                borderWidth: 'light',
                borderColor: '#99CC99',
                cornerRadius: 'md',
                justifyContent: 'center',
                paddingAll: 'md',
              },
            ],
            justifyContent: 'center',
            spacing: 'md',
          },
        ],
      },
      {
        type: 'box',
        layout: 'horizontal',
        contents: [
          {
            type: 'box',
            layout: 'horizontal',
            contents: [
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: `${weatherResult.visibility} 公尺`,
                    size: 'xl',
                    weight: 'bold',
                    align: 'center',
                  },
                  {
                    type: 'text',
                    text: '能見度',
                    size: 'xs',
                    align: 'center',
                  },
                ],
                borderWidth: 'light',
                borderColor: '#99CC99',
                cornerRadius: 'md',
                justifyContent: 'center',
                paddingAll: 'md',
              },
              {
                type: 'box',
                layout: 'vertical',
                contents: [
                  {
                    type: 'text',
                    text: weatherResult.city,
                    size: 'xs',
                    align: 'center',
                    color: '#006600',
                  },
                  {
                    type: 'text',
                    text: data.format('YYYY-MM-DD'),
                    size: 'xs',
                    align: 'center',
                    color: '#999999',
                  },
                  {
                    type: 'text',
                    text: data.format('HH:mm:ss'),
                    size: 'xxs',
                    align: 'center',
                    color: '#999999',
                  },
                ],
                borderWidth: 'light',
                borderColor: '#99CC99',
                cornerRadius: 'md',
                justifyContent: 'center',
                paddingAll: 'md',
              },
            ],
            justifyContent: 'center',
            spacing: 'md',
          },
        ],
      },
    ],
    paddingAll: 'md',
    spacing: 'md',
  };
};

export { weatherFormat };
