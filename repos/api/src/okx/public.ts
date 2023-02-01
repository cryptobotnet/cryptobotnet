import WebSocket from 'ws'

import {
  type PublicChannel,
  type PublicSubscriptionPayload,
  OKXEvent
} from 'lib/types'

import { type Debugger, debugWebSocketPublic } from 'lib/debug'
import { Endpoints } from 'lib/constants'
import { getMessageHandler } from 'lib/message-handler'

export class OKXPublicWebSocket {
  private webSocket: WebSocket
  private pingInterval: NodeJS.Timer | null
  private debug: Debugger

  private queuedMessages: string[] = []

  constructor() {
    this.webSocket = new WebSocket(Endpoints.PUBLIC)
    this.pingInterval = null
    this.debug = debugWebSocketPublic

    this.webSocket.on('open', () => {
      this.debug('connection opened')

      this.handleQueuedMessages()

      this.pingInterval = setInterval(() => {
        this.webSocket.send('ping')
      }, 15000)
    })

    const messageHandler = getMessageHandler({ debug: this.debug })

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

  subscribe(channels: PublicChannel[]) {
    const payload: PublicSubscriptionPayload = {
      op: OKXEvent.SUBSCRIBE,
      args: channels
    }
    const message = JSON.stringify(payload)

    if (this.webSocket.readyState !== 1) {
      this.queuedMessages.push(message)
    } else {
      this.webSocket.send(message)
    }
  }

  unsubscribe(channels: PublicChannel[]) {
    const payload: PublicSubscriptionPayload = {
      op: OKXEvent.UNSUBSCRIBE,
      args: channels
    }

    const message = JSON.stringify(payload)

    if (this.webSocket.readyState !== 1) {
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
