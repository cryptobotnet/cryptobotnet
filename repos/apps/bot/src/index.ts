import 'lib/dotenv'

import { bot } from 'components/bot'
import { commandStart } from 'commands/start'
import { redis } from 'lib/redis'

import { run, type RunnerHandle } from '@grammyjs/runner'

bot.use(commandStart)

const runner: RunnerHandle = run(bot)

/* NOTE: stop bot on process exit */
const stop = () => {
  runner?.isRunning() && runner?.stop()
  redis.disconnect()
}

process.once('SIGINT', stop)
process.once('SIGTERM', stop)
