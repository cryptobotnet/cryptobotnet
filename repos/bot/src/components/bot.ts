import { Bot, type Context } from 'grammy'

import { errorHandler } from './error-handler'

import { throttler } from './throttler'

export const bot = new Bot<Context>(process.env.TELEGRAM_BOT_KEY as string)

bot.catch(errorHandler)

bot.api.config.use(throttler)
