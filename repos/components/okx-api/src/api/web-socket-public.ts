import { OKXWebSocket } from 'components/web-socket'

import { type MessageHandlerParams } from 'components/message-handler'

import {
  type PublicChannel,
  PublicChannelName,
  type MarkPricePublicChannel,
  type TickersPublicChannel
  // type InstrumentsPublicChannel,
  // type OpenInterestPublicChannel,
} from 'lib/types'

interface OKXWebSocketPublicParams {
  onPriceMessage: MessageHandlerParams['onMessage']
}

export class OKXWebSocketPublic extends OKXWebSocket<PublicChannel> {
  constructor({ onPriceMessage }: OKXWebSocketPublicParams) {
    super({ onMessage: onPriceMessage })
  }

  public subscribeMarkPriceChannel(
    params: Omit<MarkPricePublicChannel, 'channel'>
  ) {
    this.subscribe([{ channel: PublicChannelName.MARK_PRICE, ...params }])
  }

  public unsubscribeMarkPriceChannel(
    params: Omit<MarkPricePublicChannel, 'channel'>
  ) {
    this.unsubscribe([{ channel: PublicChannelName.MARK_PRICE, ...params }])
  }

  public subscribeTickersChannel(
    params?: Omit<TickersPublicChannel, 'channel'>
  ) {
    this.subscribe([{ channel: PublicChannelName.TICKERS, ...params }])
  }

  public unsubscribeTickersChannel(
    params?: Omit<TickersPublicChannel, 'channel'>
  ) {
    this.unsubscribe([{ channel: PublicChannelName.TICKERS, ...params }])
  }

  // public getInstruments(params?: Omit<InstrumentsPublicChannel, 'channel'>) {
  //   this.subscribe([{ channel: PublicChannelName.INSTRUMENTS, ...params }])
  // }

  // public getOpenInterest(params: Omit<OpenInterestPublicChannel, 'channel'>) {
  //   this.subscribe([{ channel: PublicChannelName.OPEN_INTEREST, ...params }])
  // }
}
