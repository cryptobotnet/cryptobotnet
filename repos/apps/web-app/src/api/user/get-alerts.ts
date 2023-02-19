import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import type { Alert } from 'redis-client'
import { number, object, type ObjectSchema } from 'yup'

type GetAlertsPayload = {
  userId: number
}

export const getAlerts = (payload: GetAlertsPayload) =>
  fetchAPIRoute<Alert[]>(Endpoints.USER_GET_ALERTS, payload)

export const getAlertsSchema: ObjectSchema<GetAlertsPayload> = object({
  userId: number().required()
})
  .noUnknown()
  .strict()
  .required()
