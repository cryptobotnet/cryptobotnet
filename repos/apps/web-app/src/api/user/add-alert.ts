import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { number, object, string, type ObjectSchema } from 'yup'

type AddAlertPayload = {
  userId: number
  instrumentId: string
  targetPrice: number
}

export const addAlert = (payload: AddAlertPayload) =>
  fetchAPIRoute(Endpoints.USER_ADD_ALERT, payload)

export const addAlertSchema: ObjectSchema<AddAlertPayload> = object({
  userId: number().required(),
  instrumentId: string().required(),
  targetPrice: number().required()
})
  .noUnknown()
  .strict()
  .required()
