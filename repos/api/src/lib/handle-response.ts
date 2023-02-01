import { OKXEvent, type PublicChannel, type InstrumentType } from 'lib/types'
import util from 'util'

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

export const handleResponseMessage = (payload: Buffer) => {
  const payloadString = payload.toString()

  if (payloadString === 'pong') {
    return
  }

  const message: ResponseMessage = JSON.parse(payloadString)

  if (message.event === OKXEvent.LOGIN) {
    console.log('LOGIN')

    return
  }

  if (message.event === OKXEvent.ERROR) {
    const { msg, code } = message

    console.log('ERROR', msg, code)

    return
  }

  const { channel, instType, instId } = message.arg

  console.log({ channel, instId, instType })

  const { data } = message

  console.log('DATA', util.inspect(data, { showHidden: false, depth: null }))
}
