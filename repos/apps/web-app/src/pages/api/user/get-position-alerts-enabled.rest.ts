import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { getPositionAlertsEnabledSchema } from 'api'

import { redisClient } from 'lib/redis'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, getPositionAlertsEnabledSchema)

    const { userId } = req.body

    const enabled = await redisClient.getUserPositionAlertsEnabled({
      userId
    })

    res.status(200).json({
      data: enabled,
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
