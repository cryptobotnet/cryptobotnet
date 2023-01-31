import { Composer } from 'grammy'

import type { Context } from 'lib/types'
import { BotCommands, BotConversations } from 'lib/constants'
import { conversation } from './conversation'

export const key = new Composer<Context>()

key.use(conversation)

key.command(BotCommands.KEY, async ctx => {
  await ctx.conversation.enter(BotConversations.KEY)
})
