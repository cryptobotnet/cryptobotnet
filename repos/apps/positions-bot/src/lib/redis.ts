import { RedisClient } from 'redis-client'

export const redisClient = new RedisClient(process.env.REDIS_URL as string)
