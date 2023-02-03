import { createClient } from 'redis'

console.log(process.env.REDIS_URL)
export const redis = createClient({
  url: process.env.REDIS_URL
})

redis.on('error', err => console.log('Redis Client Error', err))

export const USERS_INDEX_NAME = 'idx:user'
