import fetch from 'cross-fetch'

type SendTelegramMessageParams = {
  botKey: string | undefined
  userId: number
  message: string
}

export const sendTelegramMessage = ({
  botKey,
  userId,
  message
}: SendTelegramMessageParams) => {
  if (!botKey) {
    return
  }

  try {
    fetch(`https://api.telegram.org/bot${botKey}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: userId,
        text: message,
        parse_mode: 'MarkdownV2'
      })
    })
  } catch {}
}
