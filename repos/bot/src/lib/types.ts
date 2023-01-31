import type { Context as GrammyContext, SessionFlavor } from 'grammy'
import type {
  ConversationFlavor,
  Conversation as GrammyConversation
} from '@grammyjs/conversations'

type PriceAlert = {
  ticker: string
  value: number
}

export type SessionData = {
  okxKey: string
  priceAlerts: PriceAlert[]
}

export type Context = GrammyContext &
  SessionFlavor<SessionData> &
  ConversationFlavor

export type Conversation = GrammyConversation<Context>
