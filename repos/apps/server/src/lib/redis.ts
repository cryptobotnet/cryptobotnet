import { RedisClient } from 'redis-client'

export const redis = new RedisClient(process.env.REDIS_URL as string)
