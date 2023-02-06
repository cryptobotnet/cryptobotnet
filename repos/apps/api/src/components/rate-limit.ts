import rateLimitMiddleware from 'express-rate-limit'

export const rateLimit = rateLimitMiddleware({
  windowMs: 60 * 1e3,
  max: 100,
  standardHeaders: false,
  legacyHeaders: false
})
