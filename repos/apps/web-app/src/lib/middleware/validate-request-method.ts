import type { NextApiRequest, NextApiResponse } from 'next'

export const validateRequestMethod = (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== 'POST') {
    res.status(405).end()

    throw new Error()
  }
}
