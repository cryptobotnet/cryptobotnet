import { createClient, type RedisClientType, SchemaFieldTypes } from 'redis'

import { RedisKeys } from 'lib/keys'
import { RedisKeyGetters } from 'lib/key-getters'

type AuthSecrets = {
  apiKey: string
  passphrase: string
  secretKey: string
}

export type Alert = {
  instrumentId: string
  targetPrice: number
}

export class RedisModel {
  private client: RedisClientType

  constructor(url: string) {
    this.client = createClient({ url })
    this.client.connect()
  }

  public getUserIntroMessageId(userId: number) {
    return this.client.get(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID](userId)
    )
  }

  public setUserIntroMessageId(
    userId: number,
    { messageId }: { messageId: number }
  ) {
    this.client.set(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID](userId),
      messageId
    )
  }

  public async getUserAuthSecrets(userId: number): Promise<AuthSecrets | null> {
    const secrets = await this.client.get(
      RedisKeyGetters[RedisKeys.USER_OKX_SECRETS](userId)
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

  public setUserAuthSecrets(
    userId: number,
    { apiKey, passphrase, secretKey }: AuthSecrets
  ) {
    const secrets = JSON.stringify({ apiKey, passphrase, secretKey })

    this.client.set(
      RedisKeyGetters[RedisKeys.USER_OKX_SECRETS](userId),
      secrets
    )
  }

  public createAlertsIndex() {
    this.client.ft.create(
      'idx:alerts',
      {
        userId: {
          type: SchemaFieldTypes.NUMERIC,
          sortable: true
        },
        instrumentId: SchemaFieldTypes.TAG,
        targetPrice: SchemaFieldTypes.NUMERIC
      },
      {
        ON: 'HASH',
        PREFIX: 'USER::ALERT::'
      }
    )
  }

  public addUserAlert(userId: number, { instrumentId, targetPrice }: Alert) {
    this.client.HSET(
      RedisKeyGetters[RedisKeys.USER_ALERT](userId, instrumentId, targetPrice),
      { userId, instrumentId, targetPrice }
    )
  }

  public removeUserAlert(userId: number, { instrumentId, targetPrice }: Alert) {
    this.client.DEL(
      RedisKeyGetters[RedisKeys.USER_ALERT](userId, instrumentId, targetPrice)
    )
  }

  public findAlerts(instrumentId: string, price: number) {
    const lowerBound = Math.trunc(price * (1 - 0.1 / 100))
    const upperBound = Math.trunc(price * (1 + 0.1 / 100))

    const attributes = [
      ['instrumentId', `{${instrumentId}}`],
      ['price', `[${lowerBound} ${upperBound}]`]
    ]

    return this.client.ft.search(
      'idx:alerts',
      attributes.reduce(
        (acc, [key, value], idx) =>
          `${acc}${(idx && ' ') || ''}@${key}:${value}`,
        '@'
      )
    )
  }

  public disconnect() {
    this.client.disconnect()
  }
}
