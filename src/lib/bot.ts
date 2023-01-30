import { Bot } from 'grammy'
import type { Context } from 'lib/types'

const TELEGRAM_BOT_KEY = process.env.TELEGRAM_BOT_KEY as string

export const bot = new Bot<Context>(TELEGRAM_BOT_KEY)
