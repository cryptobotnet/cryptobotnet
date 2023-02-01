export enum OKXEvent {
  SUBSCRIBE = 'subscribe',
  UNSUBSCRIBE = 'unsubscribe',
  ERROR = 'error',
  LOGIN = 'login'
}

export enum PublicChannelName {
  INSTRUMENTS = 'instruments',
  TICKERS = 'tickers',
  OPEN_INTEREST = 'open-interest',
  MARK_PRICE = 'mark-price'
}

export enum PrivateChannelName {
  ACCOUNT = 'account',
  POSITIONS = 'positions',
  BALANCE_AND_POSITION = 'balance_and_position',
  ORDERS = 'orders',
  ORDERS_ALGO = 'orders-algo',
  ALGO_ADVANCE = 'algo-advance',
  LIQUIDATION_WARNING = 'liquidation-warning'
}

export enum InstrumentType {
  SPOT = 'SPOT',
  MARGIN = 'MARGIN',
  SWAP = 'SWAP',
  FUTURES = 'FUTURES',
  OPTION = 'OPTION',
  ANY = 'ANY'
}

export interface PublicSubscriptionPayload {
  op: OKXEvent.SUBSCRIBE | OKXEvent.UNSUBSCRIBE
  args: PublicChannel[]
}

export interface PrivateSubscriptionPayload {
  op: OKXEvent.SUBSCRIBE | OKXEvent.UNSUBSCRIBE
  args: PrivateChannel[]
}

export type PublicChannel =
  | InstrumentsPublicChannel
  | TickersPublicChannel
  | OpenInterestPublicChannel
  | MarkPricePublicChannel

export type PrivateChannel =
  | AccountPrivateChannel
  | PositionsPrivateChannel
  | BalanceAndPositionChannel
  | OrdersChannel
  | OrdersAlgoChannel
  | AlgoAdvanceChannel
  | LiquidationWarningChannel

interface InstrumentsPublicChannel {
  channel: PublicChannelName.INSTRUMENTS
  instType?:
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.OPTION
    | InstrumentType.SWAP
    | InstrumentType.SPOT
}

interface TickersPublicChannel {
  channel: PublicChannelName.TICKERS
  instType?: InstrumentType
  instId?: string
}

interface OpenInterestPublicChannel {
  channel: PublicChannelName.OPEN_INTEREST
  instId: string
}

interface MarkPricePublicChannel {
  channel: PublicChannelName.MARK_PRICE
  instId: string
}

interface AccountPrivateChannel {
  channel: PrivateChannelName.ACCOUNT
  ccy?: string
}

interface PositionsPrivateChannel {
  channel: PrivateChannelName.POSITIONS
  instType:
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.OPTION
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
}

interface BalanceAndPositionChannel {
  channel: PrivateChannelName.BALANCE_AND_POSITION
}

interface OrdersChannel {
  channel: PrivateChannelName.ORDERS
  instType: InstrumentType
  instId?: string
}

interface OrdersAlgoChannel {
  channel: PrivateChannelName.ORDERS_ALGO
  instType:
    | InstrumentType.SPOT
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
}

interface AlgoAdvanceChannel {
  channel: PrivateChannelName.ORDERS_ALGO
  instType:
    | InstrumentType.SPOT
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
  algoId?: string
}

interface LiquidationWarningChannel {
  channel: PrivateChannelName.LIQUIDATION_WARNING
  instType:
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.OPTION
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
}
