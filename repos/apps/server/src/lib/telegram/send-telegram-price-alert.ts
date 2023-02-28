import fetch from 'cross-fetch'
import { debug } from 'lib/debug'
import numeral from 'numeral'
import type { Alert } from 'redis-client'

export const sendTelegramPriceAlert = ({
  userId,
  instrumentId,
  targetPrice
}: Alert) => {
  try {
    debug(
      `sent alert with ${instrumentId} price ${targetPrice} to user ${userId}`
    )

    fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_KEY_ALERTS}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: userId,
          parse_mode: 'MarkdownV2',
          text: `\`${instrumentId}\` price just crossed \`${numeral(targetPrice)
            .divide(1e8)
            .format('0,0[.][00000000]')
            .replace(',', ' ')}\``
        })
      }
    )
  } catch {}
}
