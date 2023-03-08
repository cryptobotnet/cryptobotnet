import { Router } from 'express'

import { WebSocketsManagerInstance } from 'lib/web-sockets'
import { Endpoints } from 'lib/constants'
import { debug } from 'lib/debug'

export const router = Router()

router.post(Endpoints.SUBSCRIBE_INSTRUMENT, (req, res) => {
  const { instrumentId } = req.body

  if (!instrumentId) {
    return
  }

  debug(`received request to subscribe to instrument`, instrumentId)

  WebSocketsManagerInstance.subscribeInstrument(instrumentId)

  return res.status(200).end()
})

router.post(Endpoints.UNSUBSCRIBE_INSTRUMENT, (req, res) => {
  const { instrumentId } = req.body

  if (!instrumentId) {
    return
  }

  debug(`received request to unsubscribe to instrument`, instrumentId)

  WebSocketsManagerInstance.unsubscribeInstrument(instrumentId)

  return res.status(200).end()
})

router.post(Endpoints.SUBSCRIBE_USER, (req, res) => {
  const { userId } = req.body

  if (!userId) {
    return
  }

  debug(`received request to subscribe to user`, Number(userId))

  WebSocketsManagerInstance.subscribeUser(Number(userId))

  return res.status(200).end()
})
