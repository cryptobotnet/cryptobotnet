import 'lib/dotenv'

import { app } from 'components/app'
import { priceAlertsRouter, okxRouter } from 'endpoints'

app.use('/', priceAlertsRouter)
app.use('/', okxRouter)

app.listen(process.env.PORT)
