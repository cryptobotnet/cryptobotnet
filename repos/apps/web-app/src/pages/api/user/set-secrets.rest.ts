import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { setUserSecretsSchema } from 'api'

import { redisClient } from 'lib/redis'
import { OKXHttpPrivate } from 'okx-api'

import { fetchServerRoute } from 'lib/fetch'
import { ServerEndpoints } from 'lib/urls'

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
      res.status(403).end()

      return
    }

    redisClient.setUserAuthSecrets({ userId, apiKey, passphrase, secretKey })

    await fetchServerRoute(ServerEndpoints.SUBSCRIBE_USER, { userId })

    res.status(200).end()
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
