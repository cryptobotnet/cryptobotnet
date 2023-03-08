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

export type GetInstrumentsPayload = {
  instType:
    | InstrumentType.SPOT
    | InstrumentType.MARGIN
    | InstrumentType.SWAP
    | InstrumentType.FUTURES
    | InstrumentType.OPTION
}

export type GetTickersPayload = {
  instType:
    | InstrumentType.SPOT
    | InstrumentType.SWAP
    | InstrumentType.FUTURES
    | InstrumentType.OPTION
}

export type GetTickerPayload = {
  instId: string
}

export type GetMarkPricePayload = {
  instId: string
}

export type Position = {
  adl: string
  availPos: string
  avgPx: string
  baseBal: string
  baseBorrowed: string
  baseInterest: string
  bizRefId: string
  bizRefType: string
  cTime: string
  ccy: string
  closeOrderAlgo: []
  deltaBS: string
  deltaPA: string
  gammaBS: string
  gammaPA: string
  imr: string
  instId: string
  instType: string
  interest: string
  last: string
  lever: string
  liab: string
  liabCcy: string
  liqPx: string
  margin: string
  markPx: string
  mgnMode: string
  mgnRatio: string
  mmr: string
  notionalUsd: string
  optVal: string
  pendingCloseOrdLiabVal: string
  pos: string
  posCcy: string
  posId: string
  posSide: string
  quoteBal: string
  quoteBorrowed: string
  quoteInterest: string
  spotInUseAmt: string
  spotInUseCcy: string
  thetaBS: string
  thetaPA: string
  tradeId: string
  uTime: string
  upl: string
  uplRatio: string
  usdPx: string
  vegaBS: string
  vegaPA: string
}

export type PositionHistory = {
  cTime: string
  ccy: string
  closeAvgPx: string
  closeTotalPos: string
  direction: string
  instId: string
  instType: string
  lever: string
  mgnMode: string
  openAvgPx: string
  openMaxPos: string
  pnl: string
  pnlRatio: string
  posId: string
  triggerPx: string
  type: string
  uTime: string
  uly: string
}

export type OKXWebSocketMessage = {
  channel: PublicChannelName | PrivateChannelName
  instType?: InstrumentType
  instId: string
  data?: Record<string, any>[]
}
