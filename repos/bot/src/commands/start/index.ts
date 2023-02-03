import { Composer, type Context } from 'grammy'

import { Commands, Responses } from 'lib/constants'
import { redis } from 'lib/redis'

export const commandStart = new Composer<Context>()

commandStart.command(Commands.START, async ctx => {
  const { id: chatId } = ctx.chat

  const firstResponseId = await redis.get(`USER::${chatId}`)

  console.log({ firstResponseId })

  const sendFirstMessage = async () => {
    const { message_id } = await ctx.reply(Responses.START, {
      parse_mode: 'MarkdownV2'
    })

    console.log({ message_id })

    await redis.set(`USER::${chatId}`, message_id)
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
})
