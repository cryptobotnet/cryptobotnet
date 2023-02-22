import dedent from 'dedent'

export enum Commands {
  START = 'start',
  HELP = 'help'
}

export const Responses = {
  START: dedent(
    `
    Welcome to chat with @cryptopositionsbot

    Get alerts with account position events on crypto exchanges and auto alerts every time your open positions cross PnL thresholds\\.

    \\- Market data update frequency 200 ms\\.
    \\- Instant delivery\\. Persistent on all devices\\.
    \\- Supported crypto exchanges\\: OKX\\.
    \\- Exact time of opening\\, closing and changing positions\\.

    *Use Home button near your text bar to control the bot ⚡️*

    Free forever and open\\-source\\.
    `
  ),
  HELP: dedent(
    `
    *Use Home button near your text bar to control the bot ⚡️*
    
    ||Consider to check the first message for an introduction\\.||
    `
  )
}
