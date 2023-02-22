import dedent from 'dedent'

export enum Commands {
  START = 'start',
  HELP = 'help'
}

export const Responses = {
  START: dedent(
    `
    Welcome to chat with @cryptoaIertsbot

    Get alerts for changes in crypto prices directly in your Telegram\\.

    \\- Market data update frequency 200 ms\\.
    \\- Instant delivery\\. Persistent on all devices\\.
    \\- 600\\+ crypto assets\\. Unlimited number of configured alerts\\.

    *Use Home button near your text bar to control the bot 🔥*

    Free forever and open\\-source\\.
    `
  ),
  HELP: dedent(
    `
    *Use Home button near your text bar to control the bot 🔥*
    
    ||Consider to check the first message for an introduction\\.||
    `
  )
}
