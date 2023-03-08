import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { removeAlertSchema } from 'api'

import { redisClient } from 'lib/redis'

import { fetchServerRoute } from 'lib/fetch'
import { ServerEndpoints } from 'lib/urls'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, removeAlertSchema)

    const { userId, instrumentId, targetPrice } = req.body

    redisClient.removeUserPriceAlert({ userId, instrumentId, targetPrice })

    await fetchServerRoute(ServerEndpoints.UNSUBSCRIBE_INSTRUMENT, {
      instrumentId
    })

    res.status(200).end()
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
