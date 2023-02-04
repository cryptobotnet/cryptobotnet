import { Composer, type Context } from 'grammy'
import { Commands } from 'lib/constants'
import { handler } from 'commands/start/handler'

export const commandHelp = new Composer<Context>()

commandHelp.command(Commands.HELP, handler)
