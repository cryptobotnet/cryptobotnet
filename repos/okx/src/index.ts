// import 'lib/dotenv'

// import { OKXWebSocketPublic } from 'api/web-socket-public'
// import { OKXWebSocketPrivate } from 'api/web-socket-private'

// const OKXWebSocketPublicInstance = new OKXWebSocketPublic()

// OKXWebSocketPublicInstance.getMarkPrice({ instId: 'SHIB-USDT-SWAP' })

// setTimeout(() => {
//   OKXWebSocketPublicInstance.close()
// }, 5000)

// const OKX_API_KEY = process.env.OKX_API_KEY
// const OKX_PASSPHRASE = process.env.OKX_PASSPHRASE
// const OKX_SECRET_KEY = process.env.OKX_SECRET_KEY

// if (OKX_API_KEY && OKX_PASSPHRASE && OKX_SECRET_KEY) {
//   const OKXWebSocketPrivateInstance = new OKXWebSocketPrivate({
//     apiKey: OKX_API_KEY,
//     passphrase: OKX_PASSPHRASE,
//     secretKey: OKX_SECRET_KEY
//   })

//   OKXWebSocketPrivateInstance.getAccount()
//   OKXWebSocketPrivateInstance.getAccount({ ccy: 'USDT' })
// }

export { OKXWebSocketPublic } from 'api/web-socket-public'
export { OKXWebSocketPrivate } from 'api/web-socket-private'
