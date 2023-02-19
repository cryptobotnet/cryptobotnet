import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { getAlertsSchema } from 'api'

import { redisClient } from 'lib/redis'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, getAlertsSchema)

    const { userId } = req.body

    const { documents } = await redisClient.findAlerts({ userId })
    // redisClient.disconnect()

    res.status(200).json({
      data: documents.map(
        ({ value: { userId, instrumentId, targetPrice } }) => ({
          userId: Number(userId),
          instrumentId,
          targetPrice: Number(targetPrice)
        })
      ),
      error: null
    })
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
