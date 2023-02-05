import { OKXWebSocket } from 'components/web-socket'

import {
  type PublicChannel,
  PublicChannelName,
  type InstrumentsPublicChannel,
  type TickersPublicChannel,
  type OpenInterestPublicChannel,
  type MarkPricePublicChannel
} from 'components/types'

export class OKXWebSocketPublic extends OKXWebSocket<PublicChannel> {
  constructor() {
    super()
  }

  public getInstruments(params?: Omit<InstrumentsPublicChannel, 'channel'>) {
    this.subscribe([{ channel: PublicChannelName.INSTRUMENTS, ...params }])
  }

  public getTickers(params?: Omit<TickersPublicChannel, 'channel'>) {
    this.subscribe([{ channel: PublicChannelName.TICKERS, ...params }])
  }

  public getOpenInterest(params: Omit<OpenInterestPublicChannel, 'channel'>) {
    this.subscribe([{ channel: PublicChannelName.OPEN_INTEREST, ...params }])
  }

  public getMarkPrice(params: Omit<MarkPricePublicChannel, 'channel'>) {
    this.subscribe([{ channel: PublicChannelName.MARK_PRICE, ...params }])
  }
}
