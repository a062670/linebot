import { ClientConfig, messagingApi } from '@line/bot-sdk';
import { MiddlewareConfig, middleware as lineMiddleware } from '@line/bot-sdk';

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};
const middlewareConfig: MiddlewareConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const middleware = lineMiddleware(middlewareConfig);

const client = new messagingApi.MessagingApiClient(clientConfig);

export { middleware, client };
