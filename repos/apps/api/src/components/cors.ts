import corsMiddleware from 'cors'

export const cors = corsMiddleware({
  origin: process.env.API_ALLOW_ORIGIN,
  methods: 'POST'
})
