import {
  OKXWebSocketPrivate,
  OKXWebSocketPublic,
  PublicChannelName
} from 'okx-api'
import type { Alert, RedisClient } from 'redis-client'

import throttle from 'lodash.throttle'
import EventEmitter from 'events'

type WebSocketsManagerParams = {
  redisClient: RedisClient
  sendTelegramPriceAlert: (alert: Alert) => void
}

const PRICE_MESSAGE_THROTTLE_TIMEOUT = 500

export const UNSUBSCRIBE_EVENT = 'UNSUBSCRIBE'

export class WebSocketsManager {
  private redisClient: RedisClient

  private publicConnecttion: OKXWebSocketPublic

  private subscribedInstruments: Record<string, true>
  private subscribedUsers: Record<string, OKXWebSocketPrivate>

  constructor({
    redisClient,
    sendTelegramPriceAlert
  }: WebSocketsManagerParams) {
    this.redisClient = redisClient

    const eventEmitter = new EventEmitter()

    eventEmitter.on(UNSUBSCRIBE_EVENT, (instrumentId: string) => {
      this.unsubscribeInstrument(instrumentId)
    })

    this.publicConnecttion = new OKXWebSocketPublic({
      onPriceMessage: throttle(
        async ({ channel, instId: instrumentId, data }) => {
          if (!data || channel !== PublicChannelName.TICKERS) {
            return
          }

          const tickerData = data?.[0] as { last: string }

          const currentMessagePrice = Number(tickerData.last)

          const { documents } = await this.redisClient.findAlerts({
            instrumentId: instrumentId,
            targetPrice: currentMessagePrice
          })

          if (!documents?.length) {
            return
          }

          documents.map(({ value }) => {
            this.redisClient.removeUserAlert(value)

            eventEmitter.emit(UNSUBSCRIBE_EVENT, instrumentId)

            sendTelegramPriceAlert(value)
          })
        },
        PRICE_MESSAGE_THROTTLE_TIMEOUT
      )
    })

    this.subscribedInstruments = {} // TODO: получать существующие алерты при инициализации
    this.subscribedUsers = {} // TODO: открывать по соединению на каждого активного юзера при инициализации
  }

  public async subscribeInstrument(instrumentId: string) {
    if (this.subscribedInstruments[instrumentId]) {
      return
    }

    this.publicConnecttion.subscribeTickersChannel({ instId: instrumentId })
    this.subscribedInstruments[instrumentId] = true
  }

  public async unsubscribeInstrument(instrumentId: string) {
    if (!this.subscribedInstruments[instrumentId]) {
      return
    }

    const { total } = await this.redisClient.findAlerts({ instrumentId })

    if (total === 0) {
      this.publicConnecttion.unsubscribeTickersChannel({ instId: instrumentId })
      delete this.subscribedInstruments[instrumentId]
    }
  }

  // // NOTE: дергается при включении чекбокса
  // public async subscribeUser(userId: number) {
  //   const authSecrets = await redis.getUserAuthSecrets(userId)

  //   if (!authSecrets) {
  //     return
  //   }

  //   if (!this.subscribedUsers[userId]) {
  //     const userConnection = new OKXWebSocketPrivate(authSecrets) // TODO: передавать обработчики для позиций

  //     this.subscribedUsers[userId] = userConnection

  //     userConnection.getPositions({ instType: InstrumentType.ANY })
  //   }
  // }

  // // NOTE: дергается при выключении чекбокса
  // public async unsubscribeUser(userId: number) {
  //   if (this.subscribedUsers[userId]) {
  //     this.subscribedUsers[userId].close()
  //     delete this.subscribedUsers[userId]
  //   }
  // }
}
