import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { getPositionsSchema } from 'api'

import { redisModel } from 'lib/redis'
import { OKXHttpPrivate } from 'okx-api'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, getPositionsSchema)

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=1, stale-while-revalidate=2'
    )

    const { userId } = req.body

    const secrets = await redisModel.getAuthSecrets(userId)

    redisModel.disconnect()

    if (!secrets) {
      res.status(422).end()

      return
    }

    const OKXHttpPublicInstance = new OKXHttpPrivate(secrets)

    const { data, error } = await OKXHttpPublicInstance.getPositions()

    res.status(200).json({ data, error })
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
