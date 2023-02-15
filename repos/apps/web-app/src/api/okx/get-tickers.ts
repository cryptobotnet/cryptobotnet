import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { mixed, object, type ObjectSchema } from 'yup'

import type { GetTickersPayload } from 'okx-api'

export enum InstrumentType {
  SPOT = 'SPOT',
  SWAP = 'SWAP'
}

type GetTickersResponse = { instId: string; last: number }[]

export const getTickers = (payload: GetTickersPayload) =>
  fetchAPIRoute<GetTickersResponse>(Endpoints.OKX_GET_TICKERS, payload)

export const getTickersSchema: ObjectSchema<GetTickersPayload> = object({
  instType: mixed<InstrumentType>()
    .oneOf(Object.values(InstrumentType))
    .required()
})
  .noUnknown()
  .strict()
  .required()
