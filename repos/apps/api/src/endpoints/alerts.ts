import { Router } from 'express'
import { Endpoints } from 'lib/constants'

export const alertsRouter = Router()

alertsRouter.post(Endpoints.ADD_PRICE_ALERT, (req, res) => {
  return res.send(`Received a POST HTTP method on ${Endpoints.ADD_PRICE_ALERT}`)
})

alertsRouter.post(Endpoints.REMOVE_PRICE_ALERT, (req, res) => {
  return res.send(
    `Received a POST HTTP method on ${Endpoints.REMOVE_PRICE_ALERT}`
  )
})
