import 'lib/dotenv'

import { run } from '@grammyjs/runner'
import { session } from 'grammy'
import { conversations } from '@grammyjs/conversations'

import { bot } from 'lib/bot'
import { throttler } from 'lib/throttler'
import { initial, storage } from 'lib/session'
import { errorHandler } from 'lib/error-handler'

import { start } from 'features/start'
import { help } from 'features/help'
import { key } from 'features/key'

bot.api.config.use(throttler)
bot.catch(errorHandler)

bot.use(session({ initial, storage }))
bot.use(conversations())

bot.use(start)
bot.use(help)
bot.use(key)

const runner = run(bot)
const stop = () => runner.isRunning() && runner.stop()

process.once('SIGINT', stop)
process.once('SIGTERM', stop)
