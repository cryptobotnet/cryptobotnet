/* NOTE: https://gist.github.com/konstantin24121/49da5d8023532d66cc4db1136435a885 */
/* NOTE: https://gist.github.com/zubiden/175bfed36ac186664de41f54c55e4327 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { validateTelegramSchema } from 'api'

import { createHmac } from 'crypto'

const TELEGRAM_BOT_KEY = process.env.TELEGRAM_BOT_KEY

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, validateTelegramSchema)

    const { telegramInitData } = req.body

    if (!TELEGRAM_BOT_KEY || !telegramInitData) {
      res.status(200).json({ data: { isValid: false } })

      return
    }

    const encoded = decodeURIComponent(telegramInitData)
    const arr = encoded.split('&')

    const hashIndex = arr.findIndex(str => str.startsWith('hash='))
    const hash = arr.splice(hashIndex)[0].split('=')[1]

    const dataCheckString = arr.sort((a, b) => a.localeCompare(b)).join('\n')
    const secret = createHmac('sha256', 'WebAppData').update(TELEGRAM_BOT_KEY)
    const _hash = createHmac('sha256', secret.digest())
      .update(dataCheckString)
      .digest('hex')

    const isValid = _hash === hash

    res.status(200).json({ data: { isValid } })
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
