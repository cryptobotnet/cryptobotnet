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
  private sendTelegramPriceAlert: (alert: Alert) => void

  private publicConnection: OKXWebSocketPublic

  private subscribedInstruments: Record<string, true>
  private subscribedUsers: Record<string, OKXWebSocketPrivate>

  constructor({
    redisClient,
    sendTelegramPriceAlert
  }: WebSocketsManagerParams) {
    this.redisClient = redisClient
    this.sendTelegramPriceAlert = sendTelegramPriceAlert

    this.subscribedInstruments = {} // TODO: получать существующие алерты при инициализации
    this.subscribedUsers = {} // TODO: открывать по соединению на каждого активного юзера при инициализации

    this.publicConnection = this.connect()
  }

  public async subscribeInstrument(instrumentId: string) {
    this.connect()

    if (this.subscribedInstruments[instrumentId]) {
      return
    }

    this.publicConnection.subscribeTickersChannel([instrumentId])
    this.subscribedInstruments[instrumentId] = true
  }

  public async unsubscribeInstrument(instrumentId: string) {
    this.connect()

    if (!this.subscribedInstruments[instrumentId]) {
      return
    }

    const { total } = await this.redisClient.findAlerts({ instrumentId })

    if (total === 0) {
      this.publicConnection.unsubscribeTickersChannel([instrumentId])
      delete this.subscribedInstruments[instrumentId]
    }
  }

  private connect() {
    if (this.publicConnection?.isOpen) {
      return this.publicConnection
    }

    const eventEmitter = new EventEmitter()

    eventEmitter.on(UNSUBSCRIBE_EVENT, (instrumentId: string) => {
      this.unsubscribeInstrument(instrumentId)
    })

    this.publicConnection = new OKXWebSocketPublic({
      onClose: () => {
        this.connect()
      },
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

            this.sendTelegramPriceAlert(value)
          })
        },
        PRICE_MESSAGE_THROTTLE_TIMEOUT
      )
    })

    const instruments = Object.keys(this.subscribedInstruments)

    if (instruments.length) {
      this.publicConnection.subscribeTickersChannel(instruments)
    }

    return this.publicConnection
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
