import express from 'express'

import { compression } from './compression'
import { cors } from './cors'
import { router } from 'components/router'
import { rateLimit } from './rate-limit'
import { slowDown } from './slow-down'

export const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(compression)

app.use(cors)
app.options('*', cors)

app.use('/', router)

app.use(rateLimit)
app.use(slowDown)
