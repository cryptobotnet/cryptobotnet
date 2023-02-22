import { Router } from 'express'
import { Endpoints } from 'lib/constants'

export const router = Router()

router.post(Endpoints.SUBSCRIBE_INSTRUMENT, (req, res) => {
  console.log(`received request to subscribe to instrument`, req.body)

  return res.send(
    `Received a POST HTTP method on ${Endpoints.SUBSCRIBE_INSTRUMENT}`
  )
})
