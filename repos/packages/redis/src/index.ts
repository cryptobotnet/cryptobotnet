import { createClient, type RedisClientType } from 'redis'

export class Redis {
  private client: RedisClientType

  constructor(url: string) {
    this.client = createClient({ url })

    this.client.connect()
  }

  public getFirstResponseId(chatId: number) {
    return this.client.get(getRedisUserKey(chatId))
  }

  public setFirstResponseId(chatId: number, messageId: number) {
    return this.client.set(getRedisUserKey(chatId), messageId)
  }

  public disconnect() {
    this.client.disconnect()
  }
}

enum RedisKeys {
  USER = 'USER:'
}

export const getRedisUserKey = (userId: number) => `${RedisKeys.USER}${userId}`
