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

export type AuthSecrets = {
  apiKey: string
  passphrase: string
  secretKey: string
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

export interface InstrumentsPublicChannel {
  channel: PublicChannelName.INSTRUMENTS
  instType?:
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.OPTION
    | InstrumentType.SWAP
    | InstrumentType.SPOT
}

export interface TickersPublicChannel {
  channel: PublicChannelName.TICKERS
  instType?: InstrumentType
  instId?: string
}

export interface OpenInterestPublicChannel {
  channel: PublicChannelName.OPEN_INTEREST
  instId: string
}

export interface MarkPricePublicChannel {
  channel: PublicChannelName.MARK_PRICE
  instId: string
}

export interface AccountPrivateChannel {
  channel: PrivateChannelName.ACCOUNT
  ccy?: string
}

export interface PositionsPrivateChannel {
  channel: PrivateChannelName.POSITIONS
  instType:
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.OPTION
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
}

export interface BalanceAndPositionChannel {
  channel: PrivateChannelName.BALANCE_AND_POSITION
}

export interface OrdersChannel {
  channel: PrivateChannelName.ORDERS
  instType: InstrumentType
  instId?: string
}

export interface OrdersAlgoChannel {
  channel: PrivateChannelName.ORDERS_ALGO
  instType:
    | InstrumentType.SPOT
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
}

export interface AlgoAdvanceChannel {
  channel: PrivateChannelName.ALGO_ADVANCE
  instType:
    | InstrumentType.SPOT
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
  algoId?: string
}

export interface LiquidationWarningChannel {
  channel: PrivateChannelName.LIQUIDATION_WARNING
  instType:
    | InstrumentType.FUTURES
    | InstrumentType.MARGIN
    | InstrumentType.OPTION
    | InstrumentType.SWAP
    | InstrumentType.ANY
  instId?: string
}
