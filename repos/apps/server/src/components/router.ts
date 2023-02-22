import { Router } from 'express'
import { Endpoints } from 'lib/constants'
import { debug } from 'lib/debug'
import { wsManager } from 'lib/web-sockets'

export const router = Router()

router.post(Endpoints.SUBSCRIBE_INSTRUMENT, (req, res) => {
  const { instrumentId } = req.body

  debug(`received request to subscribe to instrument`, instrumentId)

  wsManager.subscribeInstrument(instrumentId)

  return res.status(200).end()
})
