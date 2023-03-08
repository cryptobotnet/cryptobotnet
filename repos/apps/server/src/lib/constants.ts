export enum Endpoints {
  SUBSCRIBE_INSTRUMENT = '/subscribe/instrument',
  UNSUBSCRIBE_INSTRUMENT = '/unsubscribe/instrument',
  SUBSCRIBE_USER = '/subscribe/user',
  UNSUBSCRIBE_USER = '/unsubscribe/user'
}

export enum Events {
  UNSUBSCRIBE_INSTRUMENT = 'UNSUBSCRIBE_INSTRUMENT',
  SUBSCRIBE_USER = 'SUBSCRIBE_USER'
}

export enum PositionAlertType {
  OPENED = 'OPENED',
  CLOSED = 'CLOSED',
  CHANGED = 'CHANGED'
}
