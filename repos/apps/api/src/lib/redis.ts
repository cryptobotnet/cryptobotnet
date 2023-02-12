import { RedisModel } from 'redis-model'

export const redis = new RedisModel(process.env.REDIS_URL as string)
