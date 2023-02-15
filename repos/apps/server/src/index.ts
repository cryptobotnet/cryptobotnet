import 'lib/dotenv'
import { OKXWebSocketPublic } from 'okx-api'

// import { app } from 'components/app'
// import { alertsRouter, okxRouter } from 'endpoints'

// app.use('/', alertsRouter)
// app.use('/', okxRouter)

// app.listen(process.env.PORT)

const ws = new OKXWebSocketPublic()

ws.getMarkPrice({ instId: 'BTC-USDT-SWAP' })
