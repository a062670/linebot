import { ClientConfig, messagingApi } from '@line/bot-sdk';

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};
const client = new messagingApi.MessagingApiClient(clientConfig);

export default client;
