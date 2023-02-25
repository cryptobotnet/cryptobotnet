import { createClient, type RedisClientType, SchemaFieldTypes } from 'redis'

import { RedisKeys, RedisIndexes } from 'lib/keys'
import { RedisKeyGetters } from 'lib/key-getters'

type AuthSecrets = {
  apiKey: string
  passphrase: string
  secretKey: string
}

export type Alert = {
  userId: number
  instrumentId: string
  targetPrice: number
}

export class RedisClient {
  private client: RedisClientType

  constructor(url: string) {
    this.client = createClient({ url })
    this.client.connect()
  }

  public getUserIntroMessageIdInAlerts(userId: number) {
    return this.client.get(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID_ALERTS](userId)
    )
  }

  public setUserIntroMessageIdInAlerts({
    userId,
    messageId
  }: {
    userId: number
    messageId: number
  }) {
    this.client.set(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID_ALERTS](userId),
      messageId
    )
  }

  public getUserIntroMessageIdInPositions(userId: number) {
    return this.client.get(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID_POSITIONS](userId)
    )
  }

  public setUserIntroMessageIdInPositions({
    userId,
    messageId
  }: {
    userId: number
    messageId: number
  }) {
    this.client.set(
      RedisKeyGetters[RedisKeys.USER_INTRO_MESSAGE_ID_POSITIONS](userId),
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

  public setUserAuthSecrets({
    userId,
    apiKey,
    passphrase,
    secretKey
  }: AuthSecrets & { userId: number }) {
    const secrets = JSON.stringify({ apiKey, passphrase, secretKey })

    this.client.set(
      RedisKeyGetters[RedisKeys.USER_OKX_SECRETS](userId),
      secrets
    )
  }

  public createAlertsIndex() {
    try {
      this.client.ft.create(
        RedisIndexes.ALERTS,
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
          PREFIX: 'ALERT:'
        }
      )
    } catch {}
  }

  public dropAlertsIndex() {
    try {
      this.client.ft.dropIndex('idx:alerts')
    } catch {}
  }

  public addUserAlert({ userId, instrumentId, targetPrice }: Alert) {
    this.client.HSET(
      RedisKeyGetters[RedisKeys.USER_ALERT](userId, instrumentId, targetPrice),
      { userId, instrumentId, targetPrice }
    )
  }

  public removeUserAlert({ userId, instrumentId, targetPrice }: Alert) {
    this.client.DEL(
      RedisKeyGetters[RedisKeys.USER_ALERT](userId, instrumentId, targetPrice)
    )
  }

  public findAlerts({
    userId,
    instrumentId,
    targetPrice: currentPrice
  }: Partial<Alert>) {
    const attributes: string[][] = []

    if (userId) {
      attributes.push([`@userId:[${userId} ${userId}]`])
    }

    if (instrumentId) {
      attributes.push([`@instrumentId:{${instrumentId.replace(/-/g, '\\-')}}`])
    }

    if (currentPrice) {
      /* NOTE: tolerance is 0.01% */
      const tolerance = 0.01 / 100

      /* NOTE: multiply by 1e8 to avoid float numbers with high precision */
      const lowerBound = Math.trunc(currentPrice * (1 - tolerance) * 1e8)
      const upperBound = Math.trunc(currentPrice * (1 + tolerance) * 1e8)

      attributes.push([`@targetPrice:[${lowerBound} ${upperBound}]`])
    }

    const query = attributes.join(' ')

    return this.client.ft.search(RedisIndexes.ALERTS, query) as Promise<{
      total: number
      documents: { id: string; value: Alert }[]
    }>
  }

  public connect() {
    return this.client.disconnect()
  }

  public disconnect() {
    return this.client.disconnect()
  }
}
