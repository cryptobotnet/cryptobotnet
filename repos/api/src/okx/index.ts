import { v5 } from 'okex-api'
import http2 from 'http2-wrapper'

const { HttpApi, WsApi } = v5

export const httpApi = new HttpApi(
  process.env.OKX_API_KEY,
  process.env.OKX_API_SECRET,
  process.env.OKX_API_PASS,
  { transport: http2 }
)

export const wsApi = new WsApi(
  process.env.API_KEY,
  process.env.API_SECRET,
  process.env.API_PASS,
  { httpApi }
)
