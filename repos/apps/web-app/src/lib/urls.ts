export const Urls = {
  ALERTS: '/alerts',
  ADD_ALERT: '/alerts/add',
  POSITIONS: '/positions',
  SETTINGS: '/settings'
}

export const Endpoints = {
  TELEGRAM_VALIDATE: '/api/telegram/validate',

  OKX_GET_TICKERS: '/api/okx/get-tickers',
  OKX_GET_POSITIONS: '/api/okx/get-positions',

  USER_SET_SECRETS: '/api/user/set-secrets',

  USER_GET_ALERTS: '/api/user/get-alerts',
  USER_ADD_ALERT: '/api/user/add-alert',
  USER_REMOVE_ALERT: '/api/user/remove-alert',

  USER_GET_POSITION_ALERTS_ENABLED: '/api/user/get-position-alerts-enabled',
  USER_SET_POSITION_ALERTS_ENABLED: '/api/user/set-position-alerts-enabled'
}

export const ServerEndpoints = {
  SUBSCRIBE_INSTRUMENT: '/subscribe/instrument',
  UNSUBSCRIBE_INSTRUMENT: '/unsubscribe/instrument',
  SUBSCRIBE_USER: '/subscribe/user',
  UNSUBSCRIBE_USER: '/unsubscribe/user'
}
