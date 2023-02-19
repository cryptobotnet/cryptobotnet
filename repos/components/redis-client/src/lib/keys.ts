export enum RedisKeys {
  USER_INTRO_MESSAGE_ID = 'USER:$user$:INTRO_MESSAGE_ID',
  USER_OKX_SECRETS = 'USER:$user$:OKX_SECRETS',
  USER_ALERT = 'ALERT:$user$:$instrument$:$price$'
}

export enum RedisIndexes {
  ALERTS = 'idx:alerts'
}
