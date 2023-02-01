import 'lib/dotenv'

import { OKXPublicWebSocket } from 'okx/public'
import { OKXPrivateWebSocket } from 'okx/private'

import { PrivateChannelName, PublicChannelName } from 'lib/types'

const OKXPublicWebSocketInstance = new OKXPublicWebSocket()

OKXPublicWebSocketInstance.subscribe([
  {
    channel: PublicChannelName.MARK_PRICE,
    instId: 'SHIB-USDT-SWAP'
  }
])

const OKX_API_KEY = process.env.OKX_API_KEY
const OKX_PASSPHRASE = process.env.OKX_PASSPHRASE
const OKX_SECRET_KEY = process.env.OKX_SECRET_KEY

if (OKX_API_KEY && OKX_PASSPHRASE && OKX_SECRET_KEY) {
  const OKXPrivateWebSocketInstance = new OKXPrivateWebSocket({
    apiKey: OKX_API_KEY,
    passphrase: OKX_PASSPHRASE,
    secretKey: OKX_SECRET_KEY
  })

  OKXPrivateWebSocketInstance.subscribe([
    {
      channel: PrivateChannelName.BALANCE_AND_POSITION
    }
  ])
}
