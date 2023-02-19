import { RedisClient } from 'redis-client'

const globalForRedis = global as unknown as { redisClient: RedisClient }

export const redisClient =
  globalForRedis.redisClient ?? new RedisClient(process.env.REDIS_URL as string)

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redisClient = redisClient
}
