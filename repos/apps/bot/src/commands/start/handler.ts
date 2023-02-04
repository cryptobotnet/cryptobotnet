import type { CommandContext, Context } from 'grammy'
import { Responses } from 'lib/constants'
import { redis } from 'lib/redis'

export const handler = async (ctx: CommandContext<Context>) => {
  const { id: chatId } = ctx.chat

  const firstResponseId = await redis.getFirstResponseId(chatId)

  const sendFirstMessage = async () => {
    const { message_id } = await ctx.reply(Responses.START, {
      parse_mode: 'MarkdownV2'
    })

    await redis.setFirstResponseId(chatId, message_id)
  }

  if (!firstResponseId) {
    sendFirstMessage()

    return
  }

  try {
    await ctx.reply(Responses.HELP, {
      parse_mode: 'MarkdownV2',
      reply_to_message_id: parseInt(firstResponseId)
    })
  } catch (error) {
    await sendFirstMessage()
  }
}
