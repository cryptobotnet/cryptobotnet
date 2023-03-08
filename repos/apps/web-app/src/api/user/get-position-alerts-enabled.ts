import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { number, object, type ObjectSchema } from 'yup'

type GetPositionAlertsEnabledSchema = {
  userId: number
}

export const getPositionAlertsEnabled = (
  payload: GetPositionAlertsEnabledSchema
) =>
  fetchAPIRoute<{ enabled: '1' | '0' }>(
    Endpoints.USER_GET_POSITION_ALERTS_ENABLED,
    payload
  )

export const getPositionAlertsEnabledSchema: ObjectSchema<GetPositionAlertsEnabledSchema> =
  object({
    userId: number().required()
  })
    .noUnknown()
    .strict()
    .required()
