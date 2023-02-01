import WebSocket from 'ws'

import { Endpoints } from 'lib/constants'
import { sign } from 'lib/sign'
import { ping } from 'lib/ping'
import { handleResponseMessage } from 'lib/handle-response'

import {
  type PrivateSubscriptionMessage,
  type PrivateChannel,
  OKXEvent,
  PrivateChannelName,
  InstrumentType
} from 'lib/types'

type LoginParams = {
  apiKey: string
  passphrase: string
  secretKey: string
}

export const login = (
  { apiKey, passphrase, secretKey }: LoginParams,
  ws: WebSocket
) => {
  const { timestamp, signedBase64 } = sign({
    secretKey,
    method: 'GET',
    path: '/users/self/verify'
  })

  const message = {
    op: 'login',
    args: [
      {
        apiKey,
        passphrase,
        timestamp,
        sign: signedBase64
      }
    ]
  }

  ws.send(JSON.stringify(message))
}

const ws = new WebSocket(Endpoints.PRIVATE)

export const subscribePrivate = async (
  channels: PrivateChannel[]
): Promise<void> => {
  const message: PrivateSubscriptionMessage = {
    op: OKXEvent.SUBSCRIBE,
    args: channels
  }

  ws.send(JSON.stringify(message))
}

export const unsubscribePrivate = async (
  channels: PrivateChannel[]
): Promise<void> => {
  const message: PrivateSubscriptionMessage = {
    op: OKXEvent.UNSUBSCRIBE,
    args: channels
  }

  ws.send(JSON.stringify(message))
}

const OKX_API_KEY = process.env.OKX_API_KEY
const OKX_PASSPHRASE = process.env.OKX_PASSPHRASE
const OKX_SECRET_KEY = process.env.OKX_SECRET_KEY

if (OKX_API_KEY && OKX_PASSPHRASE && OKX_SECRET_KEY) {
  ws.on('error', console.error)

  ws.on('open', () => {
    login(
      {
        apiKey: OKX_API_KEY,
        passphrase: OKX_PASSPHRASE,
        secretKey: OKX_SECRET_KEY
      },
      ws
    )

    setTimeout(() => {
      subscribePrivate([
        {
          channel: PrivateChannelName.ORDERS_ALGO,
          instType: InstrumentType.ANY
          // ccy: 'USDT'
        }
      ])
    }, 1000)

    setInterval(() => {
      ping(ws)
    }, 15000)
  })

  ws.on('message', handleResponseMessage)

  ws.on('close', () => {
    console.log('on close')
  })

  // setTimeout(() => {
  //   ws.close()
  // }, 5000)
}
