import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { addAlertSchema } from 'api'

import { redisClient } from 'lib/redis'

import { fetchServerRoute } from 'lib/fetch'
import { ServerEndpoints } from 'lib/urls'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, addAlertSchema)

    const { userId, instrumentId, targetPrice } = req.body

    redisClient.addUserAlert({ userId, instrumentId, targetPrice })

    const { error } = await fetchServerRoute(
      ServerEndpoints.SUBSCRIBE_INSTRUMENT,
      {
        instrumentId
      }
    )

    if (error) {
      res.status(500).json(error)

      return
    }

    res.status(200).end()
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
