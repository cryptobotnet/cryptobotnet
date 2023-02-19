import dedent from 'dedent'

export enum Commands {
  START = 'start',
  HELP = 'help'
}

export const Responses = {
  START: dedent(
    `
    Welcome to chat with @okxalertsbot

    Get alerts about price changes and account position events on okx\\.com crypto exchange\\. Instant delivery\\. Persistent on all devices\\. Updates every 200 ms\\.

    *Use Home button near your text bar to control the bot ⚡️*

    \`Disclaimer: @okxalertsbot is third\\-party open\\-source project and is not affiliated with okx\\.com team\\. To receive account position events you need to provide your API keys from okx\\.com with read permission\\. Check out our code in case of any concerns: github\\.com/asyncink/okx\\-alerts\\-bot\\.\`
    `
  ),
  HELP: dedent(
    `
    *Use Home button near your text bar to control the bot ⚡️*
    
    ||Consider to check the first message for an introduction\\.||
    `
  )
}
