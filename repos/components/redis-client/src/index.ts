import { createClient, type RedisClientType, SchemaFieldTypes } from 'redis'

import { RedisKeys, RedisIndexes } from 'lib/keys'
import { RedisKeyGetters } from 'lib/key-getters'
import { getTolerantBounds } from 'lib/tolerance'

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

export type Position = {
  userId: number
  positionId: number
  uplRatio: number
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

  public createPriceAlertsIndex() {
    try {
      this.client.ft.create(
        RedisIndexes.PRICE_ALERTS,
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
          PREFIX: 'PRICE_ALERT:'
        }
      )
    } catch {}
  }

  public dropPriceAlertsIndex() {
    try {
      this.client.ft.dropIndex(RedisIndexes.PRICE_ALERTS)
    } catch {}
  }

  public addUserPriceAlert({ userId, instrumentId, targetPrice }: Alert) {
    this.client.HSET(
      RedisKeyGetters[RedisKeys.USER_PRICE_ALERT](
        userId,
        instrumentId,
        targetPrice
      ),
      { userId, instrumentId, targetPrice }
    )
  }

  public removeUserPriceAlert({ userId, instrumentId, targetPrice }: Alert) {
    this.client.DEL(
      RedisKeyGetters[RedisKeys.USER_PRICE_ALERT](
        userId,
        instrumentId,
        targetPrice
      )
    )
  }

  public findPriceAlerts({
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
      const [lowerBound, upperBound] = getTolerantBounds(currentPrice)

      attributes.push([`@targetPrice:[${lowerBound} ${upperBound}]`])
    }

    const query = attributes.join(' ')

    return this.client.ft.search(RedisIndexes.PRICE_ALERTS, query) as Promise<{
      total: number
      documents: { id: string; value: Alert }[]
    }>
  }

  public createPositionsIndex() {
    try {
      this.client.ft.create(
        RedisIndexes.POSITIONS,
        {
          userId: {
            type: SchemaFieldTypes.NUMERIC,
            sortable: true
          },
          positionId: {
            type: SchemaFieldTypes.NUMERIC,
            sortable: true
          },
          uplRatio: SchemaFieldTypes.NUMERIC
        },
        {
          ON: 'HASH',
          PREFIX: 'POSITION:'
        }
      )
    } catch {}
  }

  public dropPositionsIndex() {
    try {
      this.client.ft.dropIndex(RedisIndexes.POSITIONS)
    } catch {}
  }

  public dropLegacyIndex() {
    try {
      this.client.ft.dropIndex('idx:alerts')
    } catch {}
  }

  public updateUserPosition({ userId, positionId, uplRatio }: Position) {
    this.client.HSET(
      RedisKeyGetters[RedisKeys.USER_POSITION](userId, positionId),
      { userId, positionId, uplRatio }
    )
  }

  public getUserPosition({ userId, positionId }: Partial<Position>) {
    const attributes: string[][] = []

    if (userId) {
      attributes.push([`@userId:[${userId} ${userId}]`])
    }

    if (positionId) {
      attributes.push([`@positionId:[${positionId} ${positionId}]`])
    }

    const query = attributes.join(' ')

    return this.client.ft.search(RedisIndexes.POSITIONS, query) as Promise<{
      total: number
      documents: { id: string; value: Position }[]
    }>
  }

  public setUserPositionAlertsEnabled({
    userId,
    enabled
  }: {
    userId: number
    enabled: '1' | '0'
  }) {
    this.client.set(
      RedisKeyGetters[RedisKeys.USER_POSITION_ALERTS_ENABLED](userId),
      enabled
    )
  }

  public async getUserPositionAlertsEnabled({
    userId
  }: {
    userId: number
  }): Promise<{ enabled: '1' | '0' } | null> {
    const enabled = await this.client.get(
      RedisKeyGetters[RedisKeys.USER_POSITION_ALERTS_ENABLED](userId)
    )

    return { enabled: (enabled as '1' | '0') || null }
  }

  public connect() {
    return this.client.disconnect()
  }

  public disconnect() {
    return this.client.disconnect()
  }
}
