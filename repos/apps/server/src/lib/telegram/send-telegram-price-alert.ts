import fetch from 'cross-fetch'
import numeral from 'numeral'
import type { Alert } from 'redis-client'

export const sendTelegramPriceAlert = ({
  userId,
  instrumentId,
  targetPrice
}: Alert) => {
  try {
    fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_KEY_ALERTS}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          chat_id: userId,
          text: `${instrumentId} price just crossed ${numeral(targetPrice)
            .divide(1e8)
            .format('0,0[.][00000000]')
            .replace(',', ' ')}`
        })
      }
    )
  } catch {}
}
