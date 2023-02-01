import WebSocket from 'ws'

import {
  type PrivateChannel,
  type PrivateSubscriptionPayload,
  OKXEvent
} from 'lib/types'

import { type Debugger, debugWebSocketPrivate } from 'lib/debug'
import { Endpoints } from 'lib/constants'
import { getMessageHandler } from 'lib/message-handler'
import { sign } from 'lib/sign'

type AuthSecrets = {
  apiKey: string
  passphrase: string
  secretKey: string
}

export class OKXPrivateWebSocket {
  private webSocket: WebSocket
  private pingInterval: NodeJS.Timer | null
  private debug: Debugger

  private authenticated: boolean

  private queuedMessages: string[] = []

  constructor(authSecrets: AuthSecrets) {
    this.webSocket = new WebSocket(Endpoints.PRIVATE)
    this.pingInterval = null
    this.debug = debugWebSocketPrivate

    this.authenticated = false

    this.webSocket.on('open', () => {
      this.debug('connection opened')

      this.login(authSecrets)

      this.pingInterval = setInterval(() => {
        this.webSocket.send('ping')
      }, 15000)
    })

    const messageHandler = getMessageHandler({
      debug: this.debug,
      onAuthCallback: () => {
        this.authenticated = true
        this.handleQueuedMessages()
      }
    })

    this.webSocket.on('message', messageHandler)

    this.webSocket.on('error', this.debug)

    this.webSocket.on('close', () => {
      if (this.pingInterval) {
        clearInterval(this.pingInterval)

        this.debug('ping interval cleared')
      }

      this.debug('connection closed')
    })
  }

  login({ secretKey, apiKey, passphrase }: AuthSecrets) {
    const { timestamp, signedBase64 } = sign({
      secretKey,
      method: 'GET',
      path: '/users/self/verify'
    })

    const message = {
      op: OKXEvent.LOGIN,
      args: [
        {
          apiKey,
          passphrase,
          timestamp,
          sign: signedBase64
        }
      ]
    }

    this.debug('authenticated')

    this.webSocket.send(JSON.stringify(message))
  }

  subscribe(channels: PrivateChannel[]) {
    const payload: PrivateSubscriptionPayload = {
      op: OKXEvent.SUBSCRIBE,
      args: channels
    }

    const message = JSON.stringify(payload)

    if (this.webSocket.readyState !== 1 || !this.authenticated) {
      this.queuedMessages.push(message)
    } else {
      this.webSocket.send(message)
    }
  }

  unsubscribe(channels: PrivateChannel[]) {
    const payload: PrivateSubscriptionPayload = {
      op: OKXEvent.UNSUBSCRIBE,
      args: channels
    }

    const message = JSON.stringify(payload)

    if (this.webSocket.readyState !== 1 || !this.authenticated) {
      this.queuedMessages.push(message)
    } else {
      this.webSocket.send(message)
    }
  }

  handleQueuedMessages() {
    while (this.queuedMessages.length > 0) {
      this.webSocket.send(this.queuedMessages.shift() as string)
    }
  }

  close() {
    this.webSocket.close()
  }
}
