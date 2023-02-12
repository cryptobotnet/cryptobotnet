import 'lib/dotenv'

import { app } from 'components/app'
import { alertsRouter, okxRouter } from 'endpoints'

app.use('/', alertsRouter)
app.use('/', okxRouter)

app.listen(process.env.PORT)
