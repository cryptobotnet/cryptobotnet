import { fetcher } from 'components/fetcher'
import {
  GetInstrumentsPayload,
  GetTickersPayload,
  GetTickerPayload,
  GetMarkPricePayload
} from 'lib/types'

export class OKXHttpPublic {
  public async getInstruments(params: GetInstrumentsPayload) {
    return fetcher('/api/v5/public/instruments', params)
  }

  public async getTickers(params: GetTickersPayload) {
    return fetcher('/api/v5/market/tickers', params)
  }

  public async getTicker(params: GetTickerPayload) {
    return fetcher('/api/v5/market/ticker', params)
  }

  public async getMarkPrice(params: GetMarkPricePayload) {
    return fetcher('/api/v5/public/mark-price', params)
  }
}
