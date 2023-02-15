import { fetchAPIRoute } from 'lib/fetch'

import { Endpoints } from 'lib/urls'
import { object, string, type ObjectSchema } from 'yup'

type ValidateTelegramPayload = {
  telegramInitData: string
}

type ValidateTelegramResponse = {
  isValid: boolean
}

export const validateTelegram = (payload: ValidateTelegramPayload) =>
  fetchAPIRoute<ValidateTelegramResponse>(Endpoints.TELEGRAM_VALIDATE, payload)

export const validateTelegramSchema: ObjectSchema<ValidateTelegramPayload> =
  object({
    telegramInitData: string().required()
  })
    .noUnknown()
    .strict()
    .required()
