/* NOTE: https://gist.github.com/konstantin24121/49da5d8023532d66cc4db1136435a885 */
/* NOTE: https://gist.github.com/zubiden/175bfed36ac186664de41f54c55e4327 */

import type { NextApiRequest, NextApiResponse } from 'next'

import { validateRequestBody, validateRequestMethod } from 'lib/middleware'
import { validateTelegramSchema } from 'api'

import { createHmac } from 'crypto'

const TELEGRAM_BOT_KEY_ALERTS = process.env.TELEGRAM_BOT_KEY_ALERTS
const TELEGRAM_BOT_KEY_POSITIONS = process.env.TELEGRAM_BOT_KEY_POSITIONS

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    validateRequestMethod(req, res)
    await validateRequestBody(req, res, validateTelegramSchema)

    const { telegramInitData } = req.body

    if (
      !TELEGRAM_BOT_KEY_ALERTS ||
      !TELEGRAM_BOT_KEY_POSITIONS ||
      !telegramInitData
    ) {
      res.status(200).json({ data: { isValid: false } })

      return
    }

    const encoded = decodeURIComponent(telegramInitData)
    const arr = encoded.split('&')

    const hashIndex = arr.findIndex(str => str.startsWith('hash='))
    const hash = arr.splice(hashIndex)[0].split('=')[1]
    const dataCheckString = arr.sort((a, b) => a.localeCompare(b)).join('\n')

    const secretInAlerts = createHmac('sha256', 'WebAppData').update(
      TELEGRAM_BOT_KEY_ALERTS
    )
    const _hashInAlerts = createHmac('sha256', secretInAlerts.digest())
      .update(dataCheckString)
      .digest('hex')

    let isValid = _hashInAlerts === hash

    if (!isValid) {
      const secretInPositions = createHmac('sha256', 'WebAppData').update(
        TELEGRAM_BOT_KEY_POSITIONS
      )
      const _hashInPositions = createHmac('sha256', secretInPositions.digest())
        .update(dataCheckString)
        .digest('hex')

      isValid = _hashInPositions === hash
    }

    res.status(200).json({ data: { isValid } })
  } catch (error) {
    if (res.writableEnded) {
      return
    }

    res.status(422).end()
  }
}

export default handler
