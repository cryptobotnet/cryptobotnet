import { Composer } from 'grammy'
import dedent from 'dedent'

import type { Context } from 'lib/types'
import { BotCommands } from 'lib/constants'

export const help = new Composer<Context>()

help.command(BotCommands.HELP, ctx =>
  ctx.reply(
    dedent(
      `
      OKX Alerts Bot uses okx\\.com API to get crypto market data\\.

      You should provide your own API key for okx\\.com account to get price alerts and account alerts\\. Instruction how to obtain your API key is here\\.

      After you obtain you API key, run /key command to provide key to the bot\\.
      `
    ),
    { parse_mode: 'MarkdownV2' }
  )
)
