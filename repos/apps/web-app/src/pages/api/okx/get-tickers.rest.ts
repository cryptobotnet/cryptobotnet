import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { getTickersSchema } from 'api'

import { OKXHttpPublicInstance } from 'lib/okx'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, getTickersSchema)

    const { data, error } = await OKXHttpPublicInstance.getTickers(req.body)

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
