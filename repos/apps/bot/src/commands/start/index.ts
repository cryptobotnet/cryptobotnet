import { Composer, type Context } from 'grammy'
import { Commands } from 'lib/constants'
import { handler } from './handler'

export const commandStart = new Composer<Context>()

commandStart.command(Commands.START, handler)
