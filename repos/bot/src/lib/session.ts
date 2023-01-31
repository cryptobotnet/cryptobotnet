import { supabaseAdapter } from '@grammyjs/storage-supabase'

import { supabase } from 'lib/supabase'
import { SessionData } from 'lib/types'

export const initial = (): SessionData => ({
  okxKey: '',
  priceAlerts: []
})

export const storage = supabaseAdapter({
  table: 'grammy_sessions',
  supabase
})
