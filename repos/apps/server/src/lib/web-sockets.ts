import { RedisClient } from 'redis-client'
import { WebSocketsManager } from 'web-sockets'

import { sendTelegramPriceAlert } from 'lib/telegram'

const redisClient = new RedisClient(process.env.REDIS_URL as string)

export const wsManager = new WebSocketsManager({
  redisClient,
  sendTelegramPriceAlert
})
