import { Router, type Request } from 'express'
import { Endpoints } from 'lib/constants'
import { OKXHttpPublicInstance } from 'lib/okx'
import type { GetTickersPayload } from 'okx-api'

export const okxRouter = Router()

okxRouter.post(
  Endpoints.OKX_TICKERS,
  async (req: Request<object, object, GetTickersPayload>, res) => {
    const { data, error } = await OKXHttpPublicInstance.getTickers(req.body)

    res.json({ data, error }).end()
  }
)
