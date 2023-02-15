import slowDownMiddleware from 'express-slow-down'

export const slowDown = slowDownMiddleware({
  windowMs: 60 * 1e3,
  delayAfter: 100,
  delayMs: 500
})
