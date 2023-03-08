import { sendTelegramMessage } from './send-message'

import type { Alert } from 'redis-client'
import { debug } from 'lib/debug'
import numeral from 'numeral'

export const sendTelegramPriceAlert = ({
  userId,
  instrumentId,
  targetPrice
}: Alert) => {
  debug(
    `sent price alert for ${instrumentId} with ${targetPrice} to user ${userId}`
  )

  sendTelegramMessage({
    botKey: process.env.TELEGRAM_BOT_KEY_ALERTS,
    userId,
    message: `\`${instrumentId}\` price just crossed \`${numeral(targetPrice)
      .divide(1e8)
      .format('0,0[.][00000000]')
      .replace(',', ' ')}\``
  })
}
