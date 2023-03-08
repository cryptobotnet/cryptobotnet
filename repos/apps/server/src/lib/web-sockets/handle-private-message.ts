import {
  type OKXWebSocketMessage,
  type AuthSecrets,
  OKXHttpPrivate,
  PrivateChannelName
} from 'okx-api'
import { sendTelegramPositionAlert } from 'lib/telegram'
import { PositionAlertType } from 'lib/constants'
import { redisClient } from 'lib/redis'

export const handlePrivateMessage = async (
  { channel, data }: OKXWebSocketMessage,
  userId: number,
  authSecrets: AuthSecrets
) => {
  // console.log(JSON.stringify(data, null, 2))

  if (!data?.[0]) {
    return
  }

  const OKXHttpPrivateInstance = new OKXHttpPrivate(authSecrets)

  if (channel === PrivateChannelName.BALANCE_AND_POSITION) {
    const { eventType, posData } = data[0]
    const { posId, pos } = posData[0] || {}

    if (!posId) {
      return
    }

    const isPositionOpened = eventType === 'filled' && Number(pos) !== 0
    const isPositionClosed = eventType === 'filled' && Number(pos) === 0

    if (isPositionOpened) {
      const { data: position, error } =
        await OKXHttpPrivateInstance.getPosition(posId)

      if (!error && position?.[0]) {
        const {
          instId: instrumentId,
          margin,
          lever: leverage,
          notionalUsd: size,
          posSide,
          pos,
          avgPx: entryPrice,
          liqPx: liquidationPrice
        } = position?.[0]

        const side =
          posSide === 'net' ? (Number(pos) > 0 ? 'long' : 'short') : posSide

        sendTelegramPositionAlert({
          type: PositionAlertType.OPENED,
          userId,
          position: {
            instrumentId,
            margin,
            leverage,
            size,
            side,
            entryPrice,
            liquidationPrice
          }
        })
      }

      return
    }

    if (isPositionClosed) {
      const { data: history, error: historyError } =
        await OKXHttpPrivateInstance.getPositionsHistory(posId)

      if (!historyError && history?.[0]) {
        const {
          instId: instrumentId,
          pnl,
          pnlRatio,
          openAvgPx: entryPrice,
          closeAvgPx: closePrice
        } = history[0]

        sendTelegramPositionAlert({
          type: PositionAlertType.CLOSED,
          userId,
          position: {
            instrumentId,
            pnl,
            pnlRatio,
            entryPrice,
            closePrice
          }
        })
      }

      return
    }
  }

  if (channel === PrivateChannelName.POSITIONS) {
    const { posId, uplRatio } = data[0]

    /* NOTE: receive empty uplRatio for newly closed position */
    if (!uplRatio) {
      return
    }

    const positionId = Number(posId)
    const uplRatioNumber = Number(uplRatio)
    const uplRatioRound =
      uplRatioNumber < 0
        ? Math.round((uplRatioNumber * 100) / 5) * 5
        : Math.floor((uplRatioNumber * 100) / 5) * 5

    const { documents } = await redisClient.getUserPosition({
      userId,
      positionId
    })

    if (!documents?.length) {
      redisClient.updateUserPosition({
        userId,
        positionId,
        uplRatio: uplRatioRound
      })

      return
    }

    if (Number(documents[0].value.uplRatio) === uplRatioRound) {
      return
    }

    redisClient.updateUserPosition({
      userId,
      positionId,
      uplRatio: uplRatioRound
    })

    const {
      instId: instrumentId,
      margin,
      upl,
      avgPx: entryPrice,
      last: currentPrice,
      liqPx: liquidationPrice
    } = data[0]

    sendTelegramPositionAlert({
      type: PositionAlertType.CHANGED,
      userId,
      position: {
        instrumentId,
        margin,
        upl,
        uplRatio: uplRatioRound,
        entryPrice,
        currentPrice,
        liquidationPrice
      }
    })
  }
}
