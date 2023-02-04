import { createClient } from 'redis'

export const redis = createClient({
  url: process.env.REDIS_URL
})

enum RedisKeys {
  USER = 'USER:'
}

export const getRedisUserKey = (userId: number) => `${RedisKeys.USER}${userId}`
