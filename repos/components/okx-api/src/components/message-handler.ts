import type { Debugger } from 'lib/debug'

import {
  OKXEvent,
  type InstrumentType,
  type PublicChannelName,
  type PrivateChannelName
} from 'lib/types'

type OnMessageParams = {
  channel: PublicChannelName | PrivateChannelName
  instType?: InstrumentType
  instId: string
  data?: Record<string, string>[]
}

export type MessageHandlerParams = {
  debug: Debugger
  onAuth: () => void
  onMessage: (messageParams: OnMessageParams) => Promise<void> | undefined
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
  data?: Record<string, string>[]
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

    // debug({ event, channel, instId, instType })

    const { data } = message

    // debug(JSON.stringify({ data }, null, 2))

    onMessage({ channel, instType, instId, data })
  }
