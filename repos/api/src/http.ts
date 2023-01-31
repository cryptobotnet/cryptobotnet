import { httpApi } from './okx'
;(async () => {
  // console.log(await httpApi.getTickers('FUTURES'))
  // console.log(await httpApi.getAccountConfig())
  console.log(await httpApi.getAccounts('USDT'))
  console.log(await httpApi.getPositions('SWAP'))
})().catch(e => console.error(e.stack))
