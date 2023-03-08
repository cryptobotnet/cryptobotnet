import express from 'express'

import { router } from 'components/router'

import { compression } from 'middleware/compression'
import { cors } from 'middleware/cors'
import { rateLimit } from 'middleware/rate-limit'
import { slowDown } from 'middleware/slow-down'

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(compression)

app.use(cors)
app.options('*', cors)

app.use('/', router)

app.use(rateLimit)
app.use(slowDown)
