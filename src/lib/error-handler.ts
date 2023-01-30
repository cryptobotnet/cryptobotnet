import { type BotError, GrammyError, HttpError } from 'grammy'

export const errorHandler = (botError: BotError) => {
  const ctx = botError.ctx

  console.error(`Error while handling update ${ctx.update.update_id}:`)

  const error = botError.error

  if (error instanceof GrammyError) {
    console.error('Error in request:', error.description)
  } else if (error instanceof HttpError) {
    console.error('Could not contact Telegram:', error)
  } else {
    console.error('Unknown error:', error)
  }
}
