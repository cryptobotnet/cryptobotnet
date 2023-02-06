import 'lib/dotenv'

import { app } from 'components/app'
import * as endpoints from 'endpoints'

app.use('/', endpoints.priceAlertsEndpoints)

app.listen(process.env.PORT)
