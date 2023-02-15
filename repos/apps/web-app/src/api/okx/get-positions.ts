import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { number, object, type ObjectSchema } from 'yup'

type GetPositionsPayload = {
  userId: number
}

type GetPositionsResponse = any

export const getPositions = (payload: GetPositionsPayload) =>
  fetchAPIRoute<GetPositionsResponse>(Endpoints.OKX_GET_POSITIONS, payload)

export const getPositionsSchema: ObjectSchema<GetPositionsPayload> = object({
  userId: number().required()
})
  .noUnknown()
  .strict()
  .required()
