import { sendTelegramMessage } from './send-message'

import { debug } from 'lib/debug'
import { PositionAlertType } from 'lib/constants'
import dedent from 'dedent'
import align from 'align-text'
import numeral from 'numeral'

type PositionOpened = {
  instrumentId: string
  margin: string
  leverage: string
  size: string
  side: string
  entryPrice: string
  liquidationPrice: string
}

type PositionChanged = {
  instrumentId: string
  margin: string
  upl: string
  uplRatio: number
  entryPrice: string
  currentPrice: string
  liquidationPrice: string
}

type PositionClosed = {
  instrumentId: string
  pnl: string
  pnlRatio: string
  entryPrice: string
  closePrice: string
}

type PositionAlertParams =
  | {
      type: PositionAlertType.OPENED
      userId: number
      position: PositionOpened
    }
  | {
      type: PositionAlertType.CLOSED
      userId: number
      position: PositionClosed
    }
  | {
      type: PositionAlertType.CHANGED
      userId: number
      position: PositionChanged
    }

export const sendTelegramPositionAlert = ({
  type,
  userId,
  position
}: PositionAlertParams) => {
  // debug(JSON.stringify(position, null, 2))
  debug(
    `sent ${type} position alert for ${position.instrumentId} to user ${userId}`
  )

  let message = ''

  switch (type) {
    case PositionAlertType.OPENED: {
      /* NOTE: example message for newly opened position */
      /*
      80.92 x 3      = 240  long
      |       |        |    |
      margin  leverage size side

      entry price       = 0.00001230
      liquidation price = 0.00001230
      */

      const {
        instrumentId,
        margin,
        leverage,
        size,
        side,
        entryPrice,
        liquidationPrice
      } = position

      const marginFormatted = numeral(margin)
        .format('0,0[.][00]')
        .replace(',', ' ')
      const sizeFormatted = numeral(size).format('0,0[.][00]').replace(',', ' ')

      const line1 = [
        marginFormatted,
        align('x', Math.max(0, 4 - marginFormatted.length)),
        leverage,
        align('=', Math.min(6, 6 - leverage.length)),
        sizeFormatted,
        align(side, Math.max(0, 4 - sizeFormatted.length))
      ]

      const line2 = [
        '↑',
        align('↑', Math.max(5, line1[0].length + 1)),
        align('↑', Math.max(7, leverage.length + 1)),
        align('↑', Math.max(3, sizeFormatted.length - 1))
      ]

      const line3 = [
        'margin',
        align('leverage', Math.max(0, marginFormatted.length - 4)),
        align('size', Math.max(0, leverage.length - 6)),
        align('side', Math.max(0, sizeFormatted.length - 4))
      ]

      message = dedent(
        `
        \`${instrumentId}\` just *opened*

        \`\`\`
        ${line1.join(' ')}
        ${line2.join(' ')}
        ${line3.join(' ')}

        entry price       = ${numeral(entryPrice)
          .format('0,0[.][00000000]')
          .replace(',', ' ')}
        liquidation price = ${numeral(liquidationPrice)
          .format('0,0[.][00000000]')
          .replace(',', ' ')}
        \`\`\`
        `
      )
      break
    }

    case PositionAlertType.CHANGED: {
      /* NOTE: example message for changed position */
      /*
      `
      80.92 + 10% = m + 8.92 = 88
      |       |         |      |
      margin  PnL%      PnL    total

      entry price       = 0.00001230
      current price     = 0.00001230
      liquidation price = 0.00001230
      `
      */

      const {
        instrumentId,
        margin,
        upl,
        uplRatio,
        entryPrice,
        currentPrice,
        liquidationPrice
      } = position

      const marginFormatted = numeral(margin)
        .format('0,0[.][00]')
        .replace(',', ' ')
      const uplFormatted = numeral(upl)
        .format('+0,0[.][00]')
        .replace(/(\+|-)(.*)/, '$1 $2')
        .replace(',', ' ')
      const uplRatioFormatted = numeral(uplRatio)
        .divide(100)
        .format('+0,0%')
        .replace(/(\+|-)(.*)/, '$1 $2')
        .replace(',', ' ')
      const totalFormatted = numeral(margin)
        .add(upl)
        .format('0,0[.][00]')
        .replace(',', ' ')

      const line1 = [
        marginFormatted,
        align(uplRatioFormatted, Math.max(0, 4 - marginFormatted.length)),
        '=',
        'm',
        uplFormatted,
        '=',
        totalFormatted
      ]

      const line2 = [
        '↑',
        align('↑', Math.max(5, line1[0].length + 1)),
        align('↑', uplRatioFormatted.length + 3),
        align('↑', uplFormatted.length - 1)
      ]

      const line3 = [
        'margin',
        align('PnL%', Math.max(0, marginFormatted.length - 4)),
        align('PnL', uplRatioFormatted.length),
        align('total', uplFormatted.length - 3)
      ]

      message = dedent(
        `
        \`${instrumentId}\` just crossed ${uplRatioFormatted} PnL

        \`\`\`
        ${line1.join(' ')}
        ${line2.join(' ')}
        ${line3.join(' ')}

        entry price       = ${numeral(entryPrice)
          .format('0,0[.][00000000]')
          .replace(',', ' ')}
        current price     = ${numeral(currentPrice)
          .format('0,0[.][00000000]')
          .replace(',', ' ')}
        liquidation price = ${numeral(liquidationPrice)
          .format('0,0[.][00000000]')
          .replace(',', ' ')}
        \`\`\`
        `
      )
      break
    }

    case PositionAlertType.CLOSED: {
      /* NOTE: example message for newly closed position */
      /*
      `
      PnL  = +8.20
      PnL% = +10%

      entry price = 0.00001230
      close price = 0.00001230
      `
      */

      const { instrumentId, pnl, pnlRatio, entryPrice, closePrice } = position

      message = dedent(
        `
        \`${instrumentId}\` just *closed*

        \`\`\`
        PnL  = ${numeral(pnl).format('+0,0[.][00]').replace(',', ' ')}
        PnL% = ${numeral(pnlRatio).format('+0,0%').replace(',', ' ')}

        entry price = ${numeral(entryPrice)
          .format('0,0[.][00000000]')
          .replace(',', ' ')}
        close price = ${numeral(closePrice)
          .format('0,0[.][00000000]')
          .replace(',', ' ')}
        \`\`\`
        `
      )

      break
    }
  }

  const messageEscaped = message
    .replace(/\./g, '\\.')
    .replace(/\=/g, '\\=')
    .replace(/\+/g, '\\+')
    .replace(/\-/g, '\\-')

  sendTelegramMessage({
    botKey: process.env.TELEGRAM_BOT_KEY_POSITIONS,
    userId,
    message: messageEscaped
  })

  // debug(message)
}
