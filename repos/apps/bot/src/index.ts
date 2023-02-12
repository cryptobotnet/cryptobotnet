import 'lib/dotenv'

import { bot } from 'components/bot'
import { commandHelp } from 'commands/help'
import { commandStart } from 'commands/start'

import { redisModel } from 'lib/redis'
import { run, type RunnerHandle } from '@grammyjs/runner'

bot.use(commandStart)
bot.use(commandHelp)

const runner: RunnerHandle = run(bot)

/* NOTE: stop bot on process exit */
const stop = () => {
  runner?.isRunning() && runner?.stop()
  redisModel.disconnect()
}

process.once('SIGINT', stop)
process.once('SIGTERM', stop)
