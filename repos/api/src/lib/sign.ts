import { createHmac } from 'crypto'

type SignParams = {
  secretKey: string
  method: 'GET' | 'POST'
  path: string
  params?: Record<string, string>
}

export const sign = ({ secretKey, method, path }: SignParams) => {
  const hmac = createHmac('sha256', secretKey)
  const timestamp = Date.now() / 1000

  const signedBase64 = hmac
    .update(`${timestamp}${method}${path}`)
    .digest('base64')

  return { timestamp, signedBase64 }
}
