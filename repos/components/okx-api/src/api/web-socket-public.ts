import { OKXWebSocket } from 'components/web-socket'

import { type MessageHandlerParams } from 'components/message-handler'

import {
  type PublicChannel,
  PublicChannelName,
  // type InstrumentsPublicChannel,
  // type TickersPublicChannel,
  // type OpenInterestPublicChannel,
  type MarkPricePublicChannel
} from 'lib/types'

interface OKXWebSocketPublicParams {
  onMarkPriceMessage: MessageHandlerParams['onMessage']
}

export class OKXWebSocketPublic extends OKXWebSocket<PublicChannel> {
  constructor({ onMarkPriceMessage }: OKXWebSocketPublicParams) {
    super({ onMessage: onMarkPriceMessage })
  }

  // public getInstruments(params?: Omit<InstrumentsPublicChannel, 'channel'>) {
  //   this.subscribe([{ channel: PublicChannelName.INSTRUMENTS, ...params }])
  // }

  // public getTickers(params?: Omit<TickersPublicChannel, 'channel'>) {
  //   this.subscribe([{ channel: PublicChannelName.TICKERS, ...params }])
  // }

  // public getOpenInterest(params: Omit<OpenInterestPublicChannel, 'channel'>) {
  //   this.subscribe([{ channel: PublicChannelName.OPEN_INTEREST, ...params }])
  // }

  public subscribeMarkPrice(params: Omit<MarkPricePublicChannel, 'channel'>) {
    this.subscribe([{ channel: PublicChannelName.MARK_PRICE, ...params }])
  }

  public unsubscribeMarkPrice(params: Omit<MarkPricePublicChannel, 'channel'>) {
    this.unsubscribe([{ channel: PublicChannelName.MARK_PRICE, ...params }])
  }
}
