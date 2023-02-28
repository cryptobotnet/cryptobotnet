import { OKXWebSocket } from 'components/web-socket'

import { type MessageHandlerParams } from 'components/message-handler'

import { type PublicChannel, PublicChannelName } from 'lib/types'

interface OKXWebSocketPublicParams {
  onPriceMessage: MessageHandlerParams['onMessage']
}

export class OKXWebSocketPublic extends OKXWebSocket<PublicChannel> {
  constructor({ onPriceMessage }: OKXWebSocketPublicParams) {
    super({ onMessage: onPriceMessage })
  }

  public subscribeTickersChannel(instIds: string[]) {
    const params = instIds.map(instId => ({
      channel: PublicChannelName.TICKERS,
      instId
    }))

    this.subscribe(params)
  }

  public unsubscribeTickersChannel(instIds: string[]) {
    const params = instIds.map(instId => ({
      channel: PublicChannelName.TICKERS,
      instId
    }))

    this.unsubscribe(params)
  }
}
