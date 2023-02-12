import type { NextApiRequest, NextApiResponse } from 'next'
import { object, ValidationError, type AnyObject, type ObjectSchema } from 'yup'

export const validateRequestBody = async (
  req: NextApiRequest,
  res: NextApiResponse,
  schema: ObjectSchema<AnyObject>
) => {
  try {
    await schema.validate(req.body)
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(417).json({ error: error.errors })
    }

    throw new Error()
  }
}

export const emptyObjectSchema: ObjectSchema<Record<string, any>> = object({})
  .noUnknown()
  .strict()
  .required()
