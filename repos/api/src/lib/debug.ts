import debug from 'debug'

export const debugWebSocketPublic = debug('websocket:public')
export const debugWebSocketPrivate = debug('websocket:private')

export enum DebugMessage {
  OPENED = 'CONNECTION OPENED',
  CLOSED = 'CONNECTION CLOSED',
  AUTHENTICATED = 'AUTHENTICATED',
  PING_INTERVAL_CLEARED = 'PING INTERVAL CLEARED'
}

export type { Debugger } from 'debug'
