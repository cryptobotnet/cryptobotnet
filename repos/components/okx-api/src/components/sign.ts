import { createHmac } from 'isomorphic-crypto'

type SignParams = {
  secretKey: string
  method: 'GET' | 'POST'
  path: string
  type: 'websocket' | 'http'
}

export const sign = ({ secretKey, method, path, type }: SignParams) => {
  const hmac = createHmac('sha256', secretKey)
  const timestamp =
    type === 'websocket' ? Date.now() / 1000 : new Date().toISOString()

  const signedBase64 = hmac
    .update(`${timestamp}${method}${path}`)
    .digest('base64')

  return { timestamp, signedBase64 }
}
