import React, { createContext, useContext, useEffect, useState } from 'react'

import { validateTelegram } from 'api'
import { loadScript } from 'lib/load-script'

interface TelegramData {
  isValid: boolean | null
  WebApp: Window['Telegram']['WebApp'] | null
}

const initialData = {
  isValid: null,
  WebApp: null
}

const TelegramContext = createContext<TelegramData>(initialData)

export const TelegramProvider: React.FC<{
  children: (data: TelegramData) => React.ReactNode
}> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    const init = async () => {
      await loadScript('https://telegram.org/js/telegram-web-app.js')

      const telegramInitData =
        typeof window !== 'undefined' && window?.Telegram?.WebApp
          ? window.Telegram.WebApp.initData
          : null

      if (!telegramInitData) {
        return
      }

      const { data, error } = await validateTelegram({ telegramInitData })

      if (error || !data) {
        return
      }

      const { isValid } = data

      setIsValid(isValid)

      if (isValid) {
        window.Telegram?.WebApp?.expand()
      }
    }

    init()
  }, [])

  const data = {
    isValid,
    WebApp: isValid ? window.Telegram.WebApp : null
  }

  return (
    <TelegramContext.Provider value={data}>
      {children(data)}
    </TelegramContext.Provider>
  )
}

export const useTelegramWebApp = (): TelegramData => useContext(TelegramContext)
