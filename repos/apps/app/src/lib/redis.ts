import { RedisModel } from 'redis-model'

export const redisModel = new RedisModel(process.env.REDIS_URL as string)
