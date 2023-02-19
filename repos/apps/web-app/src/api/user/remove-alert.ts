import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { number, object, string, type ObjectSchema } from 'yup'

type RemoveAlertPayload = {
  userId: number
  instrumentId: string
  targetPrice: number
}

export const removeAlert = (payload: RemoveAlertPayload) =>
  fetchAPIRoute(Endpoints.USER_REMOVE_ALERT, payload)

export const removeAlertSchema: ObjectSchema<RemoveAlertPayload> = object({
  userId: number().required(),
  instrumentId: string().required(),
  targetPrice: number().required()
})
  .noUnknown()
  .strict()
  .required()
