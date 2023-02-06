import WebSocket from 'isomorphic-ws'

import { getMessageHandler } from 'components/message-handler'
import { OKXEvent, type AuthSecrets } from 'components/types'

import {
  debugWebSocketPublic,
  debugWebSocketPrivate,
  DebugMessage,
  type Debugger
} from 'lib/debug'
import { Endpoints } from 'lib/constants'
import { sign } from 'components/sign'

export class OKXWebSocket<ChannelType> {
  private readonly webSocket: WebSocket

  private readonly isPrivate: boolean
  private isAuthenticated: boolean

  private readonly queuedMessages: string[]
  private pingInterval: NodeJS.Timer | null
  private readonly debug: Debugger

  constructor(authSecrets?: AuthSecrets) {
    this.isPrivate = !!authSecrets

    this.queuedMessages = []
    this.pingInterval = null
    this.debug = this.isPrivate ? debugWebSocketPrivate : debugWebSocketPublic

    this.isAuthenticated = false

    this.webSocket = new WebSocket(
      this.isPrivate ? Endpoints.WEBSOCKET_PRIVATE : Endpoints.WEBSOCKET_PUBLIC
    )

    this.webSocket.on('open', () => {
      this.debug(DebugMessage.OPENED)

      if (this.isPrivate && authSecrets) {
        this.login(authSecrets)
      } else {
        this.handleQueuedMessages()
      }

      this.pingInterval = setInterval(() => {
        this.webSocket.send('ping')
      }, 15000)
    })

    const messageHandler = getMessageHandler({
      debug: this.debug,
      onAuthCallback: () => {
        if (!this.isPrivate) {
          return
        }

        this.isAuthenticated = true
        this.debug(DebugMessage.AUTHENTICATED)
        this.handleQueuedMessages()
      }
    })

    this.webSocket.on('message', messageHandler)
    this.webSocket.on('error', this.debug)
    this.webSocket.on('close', () => {
      if (this.pingInterval) {
        clearInterval(this.pingInterval)

        this.debug(DebugMessage.PING_INTERVAL_CLEARED)
      }

      this.debug(DebugMessage.CLOSED)
    })
  }

  private login({ secretKey, apiKey, passphrase }: AuthSecrets) {
    const { timestamp, signedBase64 } = sign({
      secretKey,
      method: 'GET',
      path: '/users/self/verify',
      type: 'websocket'
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

    this.webSocket.send(JSON.stringify(message))
  }

  private send(message: string) {
    if (
      this.webSocket.readyState !== 1 ||
      (this.isPrivate && !this.isAuthenticated)
    ) {
      this.queuedMessages.push(message)
    } else {
      this.webSocket.send(message)
    }
  }

  private handleQueuedMessages() {
    while (this.queuedMessages.length > 0) {
      this.webSocket.send(this.queuedMessages.shift() as string)
    }
  }

  protected subscribe(channels: ChannelType[]) {
    const payload = {
      op: OKXEvent.SUBSCRIBE,
      args: channels
    }

    this.send(JSON.stringify(payload))
  }

  protected unsubscribe(channels: ChannelType[]) {
    const payload = {
      op: OKXEvent.UNSUBSCRIBE,
      args: channels
    }

    this.send(JSON.stringify(payload))
  }

  public close() {
    this.webSocket?.close()
  }
}
