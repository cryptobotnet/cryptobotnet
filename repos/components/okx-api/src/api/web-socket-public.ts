import { OKXWebSocket, OKXWebSocketParams } from 'components/web-socket'
import { type PublicChannel, PublicChannelName } from 'lib/types'

export class OKXWebSocketPublic extends OKXWebSocket<PublicChannel> {
  constructor(params: OKXWebSocketParams) {
    super(params)
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
