import { MiddlewareConfig, middleware as lineMiddleware } from '@line/bot-sdk';

const middlewareConfig: MiddlewareConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const middleware = lineMiddleware(middlewareConfig);

export { middleware };
