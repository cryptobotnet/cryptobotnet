import { Composer } from 'grammy'
import dedent from 'dedent'

import type { Context } from 'lib/types'
import { BotCommands } from 'lib/constants'

export const start = new Composer<Context>()

start.command(BotCommands.START, ctx =>
  ctx.reply(
    dedent(
      `
      Welcome to the chat\\!

      OKX Alerts Bot can send alerts about price changes and trading orders on okx\\.com crypto exchange\\. Disclaimer: OKX Alerts bot is open\\-source third party bot and is not affiliated with okx\\.com team\\.

      Consider to run /help to get user guide\\.
      `
    ),
    { parse_mode: 'MarkdownV2' }
  )
)
