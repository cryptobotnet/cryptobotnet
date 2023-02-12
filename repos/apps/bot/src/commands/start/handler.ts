import type { CommandContext, Context } from 'grammy'
import { Responses } from 'lib/constants'
import { redisModel } from 'lib/redis'

export const handler = async (ctx: CommandContext<Context>) => {
  const { id: chatId } = ctx.chat

  const introMessageId = await redisModel.getIntroMessageId(chatId)

  const sendIntroMessage = async () => {
    const { message_id: messageId } = await ctx.reply(Responses.START, {
      parse_mode: 'MarkdownV2'
    })

    redisModel.setIntroMessageId(chatId, { messageId })
  }

  if (!introMessageId) {
    sendIntroMessage()

    return
  }

  try {
    await ctx.reply(Responses.HELP, {
      parse_mode: 'MarkdownV2',
      reply_to_message_id: parseInt(introMessageId)
    })
    /* NOTE: catch error if intro message was deleted */
    /* NOTE: resend intro message and rewrite introMessageId */
  } catch (error) {
    await sendIntroMessage()
  }
}
