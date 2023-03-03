import { RedisKeys } from 'lib/keys'

export const RedisKeyGetters = {
  [RedisKeys.USER_INTRO_MESSAGE_ID_ALERTS]: (userId: number) =>
    RedisKeys.USER_INTRO_MESSAGE_ID_ALERTS.replace('$user$', String(userId)),
  [RedisKeys.USER_INTRO_MESSAGE_ID_POSITIONS]: (userId: number) =>
    RedisKeys.USER_INTRO_MESSAGE_ID_POSITIONS.replace('$user$', String(userId)),
  [RedisKeys.USER_OKX_SECRETS]: (userId: number) =>
    RedisKeys.USER_OKX_SECRETS.replace('$user$', String(userId)),
  [RedisKeys.USER_ALERT]: (
    userId: number,
    instrumentId: string,
    targetPrice: number
  ) =>
    RedisKeys.USER_ALERT.replace('$user$', String(userId))
      .replace('$instrument$', instrumentId)
      .replace('$price$', String(targetPrice))
}