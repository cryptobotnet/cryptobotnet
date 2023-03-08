import { OKXWebSocket, type OKXWebSocketParams } from 'components/web-socket'
import {
  type PrivateChannel,
  PrivateChannelName,
  InstrumentType
} from 'lib/types'

export class OKXWebSocketPrivate extends OKXWebSocket<PrivateChannel> {
  constructor(params: Required<OKXWebSocketParams>) {
    super(params)
  }

  public subscribeAccount() {
    this.subscribe([{ channel: PrivateChannelName.ACCOUNT }])
  }

  public unsubscribeAccount() {
    this.unsubscribe([{ channel: PrivateChannelName.ACCOUNT }])
  }

  public subscribePositions() {
    this.subscribe([
      { channel: PrivateChannelName.POSITIONS, instType: InstrumentType.ANY }
    ])
  }

  public unsubscribePositions() {
    this.unsubscribe([
      { channel: PrivateChannelName.POSITIONS, instType: InstrumentType.ANY }
    ])
  }

  public subscribeBalanceAndPosition() {
    this.subscribe([{ channel: PrivateChannelName.BALANCE_AND_POSITION }])
  }

  public unsubscribeBalanceAndPosition() {
    this.unsubscribe([{ channel: PrivateChannelName.BALANCE_AND_POSITION }])
  }

  public subscribeOrders() {
    this.subscribe([
      { channel: PrivateChannelName.ORDERS, instType: InstrumentType.ANY }
    ])
  }

  public unsubscribeOrders() {
    this.unsubscribe([
      { channel: PrivateChannelName.ORDERS, instType: InstrumentType.ANY }
    ])
  }

  public subscribeOrdersAlgo() {
    this.subscribe([
      { channel: PrivateChannelName.ORDERS_ALGO, instType: InstrumentType.ANY }
    ])
  }

  public unsubscribeOrdersAlgo() {
    this.unsubscribe([
      { channel: PrivateChannelName.ORDERS_ALGO, instType: InstrumentType.ANY }
    ])
  }

  public subscribeAlgoAdvance() {
    this.subscribe([
      { channel: PrivateChannelName.ALGO_ADVANCE, instType: InstrumentType.ANY }
    ])
  }

  public unsubscribeAlgoAdvance() {
    this.unsubscribe([
      { channel: PrivateChannelName.ALGO_ADVANCE, instType: InstrumentType.ANY }
    ])
  }

  public subscribeLiquidationWarning() {
    this.subscribe([
      {
        channel: PrivateChannelName.LIQUIDATION_WARNING,
        instType: InstrumentType.ANY
      }
    ])
  }

  public unsubscribeLiquidationWarning() {
    this.unsubscribe([
      {
        channel: PrivateChannelName.LIQUIDATION_WARNING,
        instType: InstrumentType.ANY
      }
    ])
  }
}
