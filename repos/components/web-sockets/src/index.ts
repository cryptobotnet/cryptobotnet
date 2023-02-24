import {
  type InstrumentType,
  // InstrumentType,
  OKXWebSocketPrivate,
  OKXWebSocketPublic,
  PublicChannelName
} from 'okx-api'
import type { Alert, RedisClient } from 'redis-client'

import throttle from 'lodash.throttle'

type WebSocketsManagerParams = {
  redisClient: RedisClient
  sendTelegramPriceAlert: (alert: Alert) => void
}

export class WebSocketsManager {
  private publicConnecttion: OKXWebSocketPublic

  private subscribedInstruments: Record<string, true>
  private subscribedUsers: Record<string, OKXWebSocketPrivate>

  constructor(params: WebSocketsManagerParams) {
    const { redisClient, sendTelegramPriceAlert } = params

    const throttledSendAlert = throttle(sendTelegramPriceAlert, 1e4)

    this.publicConnecttion = new OKXWebSocketPublic({
      onMarkPriceMessage: async ({ channel, instId, data }) => {
        if (!data || channel !== PublicChannelName.MARK_PRICE) {
          return
        }

        const markPriceData = data?.[0] as {
          instId: string
          instType: InstrumentType
          markPx?: string
          ts?: string
        }

        const currentMessagePrice = Number(markPriceData.markPx)

        const { documents } = await redisClient.findAlerts({
          instrumentId: instId,
          targetPrice: currentMessagePrice
        })

        if (!documents?.length) {
          return
        }

        documents.map(({ value }) => {
          redisClient.removeUserAlert(value)
          throttledSendAlert(value)
        })
      }
    })

    this.subscribedInstruments = {} // TODO: получать существующие алерты при инициализации
    this.subscribedUsers = {} // TODO: открывать по соединению на каждого активного юзера при инициализации
  }

  public async subscribeInstrument(instrumentId: string) {
    if (this.subscribedInstruments[instrumentId]) {
      return
    }

    this.publicConnecttion.subscribeMarkPrice({ instId: instrumentId })
    this.subscribedInstruments[instrumentId] = true
  }

  public async unsubscribeInstrument(instrumentId: string) {
    this.publicConnecttion.unsubscribeMarkPrice({ instId: instrumentId })

    if (this.subscribedInstruments[instrumentId]) {
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
