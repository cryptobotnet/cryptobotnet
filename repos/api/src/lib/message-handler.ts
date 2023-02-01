import { OKXEvent, type PublicChannel, type InstrumentType } from 'lib/types'

import type { Debugger } from 'lib/debug'
import util from 'util'

type MessageHandlerParams = {
  debug: Debugger
  onAuthCallback?: () => void
}

type ResponseMessage = {
  event: OKXEvent
  arg: {
    channel: PublicChannel
    instType?: InstrumentType
    instId: string
  }
  msg?: string
  code?: string
  data?: Record<string, string>[]
}

export const getMessageHandler =
  ({ debug, onAuthCallback }: MessageHandlerParams) =>
  (payload: Buffer) => {
    console.log('%s', payload)

    const payloadString = payload.toString()

    if (payloadString === 'pong') {
      return
    }

    const message: ResponseMessage = JSON.parse(payloadString)

    const { event } = message

    if (event === OKXEvent.LOGIN || event === OKXEvent.ERROR) {
      const { msg, code } = message

      debug(event, msg, code)

      if (event === OKXEvent.LOGIN && code === '0') {
        onAuthCallback?.()
      }

      return
    }

    const { channel, instType, instId } = message.arg

    debug({ event, channel, instId, instType })

    const { data } = message

    debug(util.inspect({ data }, { showHidden: false, depth: null }))
  }
