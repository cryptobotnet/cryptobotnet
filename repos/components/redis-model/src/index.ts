import { createClient, type RedisClientType } from 'redis'

import { RedisKeys } from 'lib/keys'
import { RedisKeyGetters } from 'lib/key-getters'

export type AuthSecrets = {
  apiKey: string
  passphrase: string
  secretKey: string
}

export class RedisModel {
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

  public setIntroMessageId(
    chatId: number,
    { messageId }: { messageId: number }
  ) {
    this.client.set(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID](chatId),
      messageId
    )
  }

  public async getAuthSecrets(chatId: number): Promise<AuthSecrets | null> {
    const secrets = await this.client.get(
      RedisKeyGetters[RedisKeys.USER_OKX_SECRETS](chatId)
    )

    if (!secrets) {
      return null
    }

    try {
      const { apiKey, passphrase, secretKey } = JSON.parse(secrets)

      if (!apiKey || !passphrase || !secretKey) {
        return null
      }

      return { apiKey, passphrase, secretKey }
    } catch {
      return null
    }
  }

  public setAuthSecrets(
    chatId: number,
    { apiKey, passphrase, secretKey }: AuthSecrets
  ) {
    const secrets = JSON.stringify({ apiKey, passphrase, secretKey })

    this.client.set(
      RedisKeyGetters[RedisKeys.USER_OKX_SECRETS](chatId),
      secrets
    )
  }

  public disconnect() {
    this.client.disconnect()
  }
}
