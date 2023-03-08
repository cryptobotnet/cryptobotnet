import { type OKXWebSocketMessage, PublicChannelName } from 'okx-api'
import { redisClient } from 'lib/redis'
import type EventEmitter from 'events'
import { Events } from 'lib/constants'
import { sendTelegramPriceAlert } from 'lib/telegram'

export const handlePublicMessage = async (
  { channel, instId: instrumentId, data }: OKXWebSocketMessage,
  eventEmitter: EventEmitter
) => {
  if (!data || channel !== PublicChannelName.TICKERS) {
    return
  }

  const tickerData = data?.[0] as { last: string }

  const currentMessagePrice = Number(tickerData.last)

  const { documents } = await redisClient.findPriceAlerts({
    instrumentId: instrumentId,
    targetPrice: currentMessagePrice
  })

  if (!documents?.length) {
    return
  }

  documents.map(({ value }) => {
    redisClient.removeUserPriceAlert(value)

    eventEmitter.emit(Events.UNSUBSCRIBE_INSTRUMENT, instrumentId)

    sendTelegramPriceAlert(value)
  })
}
