import WebSocket from 'ws'

import { Endpoints } from 'lib/constants'
import { ping } from 'lib/ping'
import { handleResponseMessage } from 'lib/handle-response'

import {
  type PublicSubscriptionMessage,
  type PublicChannel,
  OKXEvent,
  PublicChannelName
} from 'lib/types'

export const subscribePublic = async (
  channels: PublicChannel[]
): Promise<void> => {
  const message: PublicSubscriptionMessage = {
    op: OKXEvent.SUBSCRIBE,
    args: channels
  }

  ws.send(JSON.stringify(message))
}

export const unsubscribePublic = async (
  channels: PublicChannel[]
): Promise<void> => {
  const message: PublicSubscriptionMessage = {
    op: OKXEvent.UNSUBSCRIBE,
    args: channels
  }

  ws.send(JSON.stringify(message))
}

const ws = new WebSocket(Endpoints.PUBLIC)

ws.on('error', console.error)

ws.on('open', () => {
  subscribePublic([
    {
      channel: PublicChannelName.MARK_PRICE,
      instId: 'SHIB-USDT-SWAP'
    }
  ])

  setInterval(() => {
    ping(ws)
  }, 15000)
})

ws.on('message', handleResponseMessage)

ws.on('close', () => {
  console.log('on close')
})

setTimeout(() => {
  ws.close()
}, 5000)
