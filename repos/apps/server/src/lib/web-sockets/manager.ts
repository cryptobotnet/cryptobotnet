import { OKXWebSocketPrivate, OKXWebSocketPublic } from 'okx-api'
import { redisClient } from 'lib/redis'
import { Events } from 'lib/constants'

import throttle from 'lodash.throttle'
import EventEmitter from 'events'

import { handlePublicMessage } from './handle-public-message'
import { handlePrivateMessage } from './handle-private-message'

const PRICE_MESSAGE_THROTTLE_TIMEOUT = 500
const POSITION_MESSAGE_THROTTLE_TIMEOUT = 5 * 60 * 1e3

const PRIVATE_CONNECTION_EMITTED_CLOSE_CODE = 4090

export class WebSocketsManager {
  private eventEmitter: EventEmitter
  private publicConnection: OKXWebSocketPublic

  private subscribedInstruments: Record<string, true>
  private subscribedUsers: Record<string, OKXWebSocketPrivate>

  constructor() {
    this.subscribedInstruments = {} // TODO: получать существующие алерты при инициализации
    this.subscribedUsers = {} // TODO: открывать по соединению на каждого активного юзера при инициализации

    this.publicConnection = this.connectPublic()

    this.eventEmitter = new EventEmitter()
    this.eventEmitter.on(
      Events.UNSUBSCRIBE_INSTRUMENT,
      (instrumentId: string) => {
        this.unsubscribeInstrument(instrumentId)
      }
    )
  }

  public async subscribeInstrument(instrumentId: string) {
    this.connectPublic()

    if (this.subscribedInstruments[instrumentId]) {
      return
    }

    this.publicConnection.subscribeTickersChannel([instrumentId])
    this.subscribedInstruments[instrumentId] = true
  }

  public async unsubscribeInstrument(instrumentId: string) {
    this.connectPublic()

    if (!this.subscribedInstruments[instrumentId]) {
      return
    }

    const { total } = await redisClient.findPriceAlerts({ instrumentId })

    if (total === 0) {
      this.publicConnection.unsubscribeTickersChannel([instrumentId])
      delete this.subscribedInstruments[instrumentId]
    }
  }

  private connectPublic() {
    if (this.publicConnection?.isOpen) {
      return this.publicConnection
    }

    this.publicConnection = new OKXWebSocketPublic({
      onClose: () => {
        this.connectPublic()
      },
      onMessage: throttle(
        message => handlePublicMessage(message, this.eventEmitter),
        PRICE_MESSAGE_THROTTLE_TIMEOUT
      )
    })

    const instruments = Object.keys(this.subscribedInstruments)

    if (instruments.length) {
      this.publicConnection.subscribeTickersChannel(instruments)
    }

    return this.publicConnection
  }

  public async subscribeUser(userId: number) {
    const authSecrets = await redisClient.getUserAuthSecrets(userId)

    if (!authSecrets || this.subscribedUsers[userId]) {
      return
    }

    const userConnection = new OKXWebSocketPrivate({
      authSecrets,
      onClose: code => {
        delete this.subscribedUsers[userId]

        if (code !== PRIVATE_CONNECTION_EMITTED_CLOSE_CODE) {
          this.subscribeUser(userId)
        }
      },
      onMessage: throttle(
        message => handlePrivateMessage(message, userId, authSecrets),
        POSITION_MESSAGE_THROTTLE_TIMEOUT
      )
    })

    this.subscribedUsers[userId] = userConnection

    userConnection.subscribePositions()
    userConnection.subscribeBalanceAndPosition()
  }

  public async unsubscribeUser(userId: number) {
    if (!this.subscribedUsers[userId]) {
      return
    }

    const userConnection = this.subscribedUsers[userId]

    userConnection.close(PRIVATE_CONNECTION_EMITTED_CLOSE_CODE)
  }
}
