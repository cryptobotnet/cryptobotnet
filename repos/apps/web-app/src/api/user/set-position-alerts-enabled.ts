import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { number, object, string, type ObjectSchema } from 'yup'

type SetPositionAlertsEnabledSchema = {
  userId: number
  enabled: '1' | '0'
}

export const setPositionAlertsEnabled = (
  payload: SetPositionAlertsEnabledSchema
) => fetchAPIRoute(Endpoints.USER_SET_POSITION_ALERTS_ENABLED, payload)

export const setPositionAlertsEnabledSchema: ObjectSchema<SetPositionAlertsEnabledSchema> =
  object({
    userId: number().required(),
    enabled: string().oneOf(['1', '0']).required()
  })
    .noUnknown()
    .strict()
    .required()
