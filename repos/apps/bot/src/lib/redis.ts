import { Redis } from 'redis'

export const redis = new Redis(process.env.REDIS_URL as string)
