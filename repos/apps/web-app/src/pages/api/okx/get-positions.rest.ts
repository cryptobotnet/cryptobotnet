import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { getPositionsSchema } from 'api'

import { redisClient } from 'lib/redis'
import { OKXHttpPrivate } from 'okx-api'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, getPositionsSchema)

    const { userId } = req.body

    const secrets = await redisClient.getUserAuthSecrets(userId)

    if (!secrets) {
      res.status(403).end()

      return
    }

    const OKXHttpPublicInstance = new OKXHttpPrivate(secrets)

    const { data, error } = await OKXHttpPublicInstance.getPositions()

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate'
    )
    res.status(200).json({ data, error })
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
