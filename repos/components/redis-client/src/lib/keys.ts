export enum RedisKeys {
  USER_INTRO_MESSAGE_ID_ALERTS = 'USER:$user$:INTRO_MESSAGE_ID:ALERTS',
  USER_INTRO_MESSAGE_ID_POSITIONS = 'USER:$user$:INTRO_MESSAGE_ID:POSITIONS',
  USER_OKX_SECRETS = 'USER:$user$:OKX_SECRETS',
  USER_ALERT = 'ALERT:$user$:$instrument$:$price$'
}

export enum RedisIndexes {
  ALERTS = 'idx:alerts'
}
