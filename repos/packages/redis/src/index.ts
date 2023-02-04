import { createClient, type RedisClientType } from 'redis'

import { RedisKeys } from 'lib/keys'
import { RedisKeyGetters } from 'lib/key-getters'

export class Redis {
  private client: RedisClientType

  constructor(url: string) {
    this.client = createClient({ url })
    this.client.connect()
  }

  public getIntroMessageId(chatId: number) {
    return this.client.get(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID](chatId)
    )
  }

  public setIntroMessageId(chatId: number, messageId: number) {
    return this.client.set(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID](chatId),
      messageId
    )
  }

  public disconnect() {
    this.client.disconnect()
  }
}
