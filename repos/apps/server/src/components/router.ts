import { Router } from 'express'
import { Endpoints } from 'lib/constants'
import { debug } from 'lib/debug'
import { wsManager } from 'lib/web-sockets'

export const router = Router()

router.post(Endpoints.SUBSCRIBE_INSTRUMENT, (req, res) => {
  const { instrumentId } = req.body

  if (!instrumentId) {
    return
  }

  debug(`received request to subscribe to instrument`, instrumentId)

  wsManager.subscribeInstrument(instrumentId)

  return res.status(200).end()
})

router.post(Endpoints.UNSUBSCRIBE_INSTRUMENT, (req, res) => {
  const { instrumentId } = req.body

  if (!instrumentId) {
    return
  }

  debug(`received request to unsubscribe to instrument`, instrumentId)

  wsManager.unsubscribeInstrument(instrumentId)

  return res.status(200).end()
})
