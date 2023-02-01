import type { WebSocket } from 'ws'

export const ping = async (ws: WebSocket) => {
  ws.send('ping')
}
