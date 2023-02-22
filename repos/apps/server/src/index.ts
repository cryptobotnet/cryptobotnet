import 'lib/dotenv'

import { app } from 'components/app'

app.listen(process.env.API_PORT)
