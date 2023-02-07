import { OKXWebSocket } from 'components/web-socket'

import {
  type PrivateChannel,
  type AuthSecrets,
  PrivateChannelName,
  type AccountPrivateChannel,
  type PositionsPrivateChannel,
  type OrdersChannel,
  type OrdersAlgoChannel,
  type AlgoAdvanceChannel,
  type LiquidationWarningChannel
} from 'lib/types'

export class OKXWebSocketPrivate extends OKXWebSocket<PrivateChannel> {
  constructor(authSecrets: AuthSecrets) {
    super(authSecrets)
  }

  public getAccount(params?: Omit<AccountPrivateChannel, 'channel'>) {
    this.subscribe([{ channel: PrivateChannelName.ACCOUNT, ...params }])
  }

  public getPositions(params: Omit<PositionsPrivateChannel, 'channel'>) {
    this.subscribe([{ channel: PrivateChannelName.POSITIONS, ...params }])
  }

  public getBalanceAndPosition() {
    this.subscribe([{ channel: PrivateChannelName.BALANCE_AND_POSITION }])
  }

  public getOrders(params: Omit<OrdersChannel, 'channel'>) {
    this.subscribe([{ channel: PrivateChannelName.ORDERS, ...params }])
  }

  public getOrdersAlgo(params: Omit<OrdersAlgoChannel, 'channel'>) {
    this.subscribe([{ channel: PrivateChannelName.ORDERS_ALGO, ...params }])
  }

  public getAlgoAdvance(params: Omit<AlgoAdvanceChannel, 'channel'>) {
    this.subscribe([{ channel: PrivateChannelName.ALGO_ADVANCE, ...params }])
  }

  public getLiquidationWarning(
    params: Omit<LiquidationWarningChannel, 'channel'>
  ) {
    this.subscribe([
      { channel: PrivateChannelName.LIQUIDATION_WARNING, ...params }
    ])
  }
}
