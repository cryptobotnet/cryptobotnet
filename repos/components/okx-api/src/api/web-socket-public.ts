import { OKXWebSocket } from 'components/web-socket'

import { type OKXWebSocketParams } from 'components/web-socket'

import { type PublicChannel, PublicChannelName } from 'lib/types'

interface OKXWebSocketPublicParams {
  onPriceMessage: OKXWebSocketParams['onMessage']
  onClose: OKXWebSocketParams['onClose']
}

export class OKXWebSocketPublic extends OKXWebSocket<PublicChannel> {
  constructor({ onPriceMessage, onClose }: OKXWebSocketPublicParams) {
    super({ onMessage: onPriceMessage, onClose })
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
