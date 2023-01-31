import { wsApi } from './okx'
;(async () => {
  // console.log(
  //   await wsApi.subscribePublic({
  //     channel: 'instruments',
  //     instType: 'FUTURES'
  //   })
  // )

  // wsApi.on('instruments', console.log)

  // console.log(
  //   await wsApi.subscribePublic([
  //     {
  //       channel: 'tickers',
  //       instId: 'SHIB-USDT-SWAP'
  //     }
  //   ])
  // )

  // wsApi.on('tickers', ([data]: any) => {
  //   const { instId, last } = data

  //   console.log(instId, last)
  // })

  await wsApi.subscribePrivate([
    {
      channel: 'account'
      // ccy: 'USDT'
    },
    {
      channel: 'balance_and_position'
    },
    {
      channel: 'positions',
      instType: 'ANY'
    },
    {
      channel: 'orders',
      instType: 'ANY'
    },
    {
      channel: 'orders-algo',
      instType: 'ANY'
    }
  ])

  wsApi.on('account', console.log)
  wsApi.on('balance_and_position', console.log)
  wsApi.on('positions', console.log)
  wsApi.on('orders', console.log)
  wsApi.on('orders-algo', console.log)

  wsApi.on('error', console.error)
})().catch(e => console.error(e.stack))
