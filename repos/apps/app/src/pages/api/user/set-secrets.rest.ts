import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { setUserSecretsSchema } from 'api'

import { OKXHttpPrivate } from 'okx-api'
import { redisModel } from 'lib/redis'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, setUserSecretsSchema)

    const { userId, apiKey, passphrase, secretKey } = req.body

    const OKXHttpPublicInstance = new OKXHttpPrivate({
      apiKey,
      passphrase,
      secretKey
    })

    const { data, error } = await OKXHttpPublicInstance.getPositions()

    if (!data || error) {
      res.status(422).end()

      return
    }

    redisModel.setAuthSecrets(userId, { apiKey, passphrase, secretKey })
    redisModel.disconnect()

    res.status(200).end()
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
