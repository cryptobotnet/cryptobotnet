import { RedisKeys } from 'lib/keys'

export const RedisKeyGetters = {
  [RedisKeys.USER_INTRO_MESSAGE_ID]: (userId: number) =>
    RedisKeys.USER_INTRO_MESSAGE_ID.replace('$user$', String(userId)),
  [RedisKeys.USER_OKX_SECRETS]: (userId: number) =>
    RedisKeys.USER_OKX_SECRETS.replace('$user$', String(userId))
}
