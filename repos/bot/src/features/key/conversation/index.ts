import dedent from 'dedent'
import { createConversation } from '@grammyjs/conversations'

import type { Context, Conversation } from 'lib/types'
import { BotConversations } from 'lib/constants'

export const conversation = createConversation(
  async (conversation: Conversation, ctx: Context) => {
    await ctx.reply(
      dedent(
        `
          Instruction how to obtain your API key is here\\.
  
          API key have the following format:
  
          \`some api key\`
  
          Enter your API key:
          `
      ),
      { parse_mode: 'MarkdownV2' }
    )

    const key = await getValidKey(conversation, ctx)

    conversation.session = {
      ...conversation.session,
      okxKey: key
    }

    await ctx.reply(`Your API key is valid.`)
  },
  BotConversations.KEY
)

const getValidKey = async (
  conversation: Conversation,
  ctx: Context
): Promise<string> => {
  const { message } = await conversation.wait()

  if (message?.text?.length === 3) {
    return message?.text
  }

  await ctx.reply('Invalid API key. Please, enter your API key:')

  return getValidKey(conversation, ctx)
}
