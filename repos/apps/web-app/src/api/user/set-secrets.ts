import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { number, object, string, type ObjectSchema } from 'yup'

type SetUserSecretsPayload = {
  userId: number
  apiKey: string
  passphrase: string
  secretKey: string
}

export const setUserSecrets = (payload: SetUserSecretsPayload) =>
  fetchAPIRoute(Endpoints.USER_SET_SECRETS, payload)

export const setUserSecretsSchema: ObjectSchema<SetUserSecretsPayload> = object(
  {
    userId: number().required(),
    apiKey: string().required(),
    passphrase: string().required(),
    secretKey: string().required()
  }
)
  .noUnknown()
  .strict()
  .required()
