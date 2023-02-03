import 'lib/dotenv'

import { bot } from 'components/bot'
import { commandStart } from 'commands/start'

import { run, type RunnerHandle } from '@grammyjs/runner'

import { redis } from 'lib/redis'

bot.use(commandStart)

redis.connect()

const runner: RunnerHandle = run(bot)

/* NOTE: stop bot on process exit */
const stop = () => {
  runner?.isRunning() && runner?.stop()
  redis.disconnect()
}

process.once('SIGINT', stop)
process.once('SIGTERM', stop)
