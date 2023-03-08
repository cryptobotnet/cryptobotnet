import type { Debugger } from 'lib/debug'

import {
  OKXEvent,
  type OKXWebSocketMessage,
  type PublicChannelName,
  type PrivateChannelName,
  type InstrumentType
} from 'lib/types'

export type MessageHandlerParams = {
  debug: Debugger
  onAuth: () => void
  onMessage: (messageParams: OKXWebSocketMessage) => Promise<void> | undefined
}

type ResponseMessage = {
  event: OKXEvent
  arg: {
    channel: PublicChannelName | PrivateChannelName
    instType?: InstrumentType
    instId: string
  }
  msg?: string
  code?: string
  data?: Record<string, unknown>[]
}

export const getMessageHandler =
  ({ debug, onAuth, onMessage }: MessageHandlerParams) =>
  (payload: Buffer) => {
    // console.log('%s', payload)

    const payloadString = payload.toString()

    if (payloadString === 'pong') {
      return
    }

    const message: ResponseMessage = JSON.parse(payloadString)

    const { event } = message

    if (event === OKXEvent.LOGIN || event === OKXEvent.ERROR) {
      const { msg, code } = message

      debug({ event, msg, code })

      if (event === OKXEvent.LOGIN && code === '0') {
        onAuth()
      }

      return
    }

    const { channel, instType, instId } = message.arg

    if (event === OKXEvent.SUBSCRIBE || event === OKXEvent.UNSUBSCRIBE) {
      debug(`event: ${event}. channel: ${channel}, ${instId}, ${instType}`)
      // debug({ event, channel, instId, instType })

      return
    }

    const { data } = message

    if (data) {
      onMessage({ channel, instType, instId, data })

      // debug(data?.[0]?.instId, data?.[0]?.markPx)
      // debug(JSON.stringify({ data }, null, 2))
    }
  }
