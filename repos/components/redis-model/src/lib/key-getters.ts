import { RedisKeys } from 'lib/keys'

export const RedisKeyGetters = {
  [RedisKeys.USER_INTRO_MESSAGE_ID]: (userId: number) =>
    `${RedisKeys.USER_INTRO_MESSAGE_ID}${userId}`
}
