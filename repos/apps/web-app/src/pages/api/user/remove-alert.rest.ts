import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { removeAlertSchema } from 'api'

import { redisClient } from 'lib/redis'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, removeAlertSchema)

    const { userId, instrumentId, targetPrice } = req.body

    redisClient.removeUserAlert({ userId, instrumentId, targetPrice })
    // redisClient.disconnect()

    res.status(200).end()
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
