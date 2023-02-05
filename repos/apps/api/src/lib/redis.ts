import { Redis } from 'redis-model'

export const redis = new Redis(process.env.REDIS_URL as string)
