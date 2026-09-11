import { ConnectionOptions } from 'bullmq';
import { config } from './env';

export const redisConnectionOptions: ConnectionOptions = {
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
};
