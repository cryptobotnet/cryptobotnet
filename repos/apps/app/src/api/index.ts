import { fetcher } from 'lib/fetcher'
import type { GetTickersPayload } from 'okx-api'

export enum InstrumentType {
  SPOT = 'SPOT',
  SWAP = 'SWAP'
}

type GetTickersResponse = { instId: string; last: number }[]

export const getTickers = (payload: GetTickersPayload) =>
  fetcher<GetTickersResponse>('/okx/tickers', payload)
