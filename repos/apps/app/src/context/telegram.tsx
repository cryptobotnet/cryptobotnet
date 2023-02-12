import React, { createContext, useContext, useEffect, useState } from 'react'

import { validateTelegram } from 'api'
import { loadScript } from 'lib/load-script'
import { isWebApp } from 'lib/is-web-app'

interface TelegramData {
  isValid: boolean | null
  webApp: Window['Telegram']['WebApp'] | null
}

const initialData = {
  isValid: null,
  webApp: null
}

const TelegramContext = createContext<TelegramData>(initialData)

export const TelegramProvider: React.FC<{
  children: (data: TelegramData) => React.ReactNode
}> = ({ children }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null)

  useEffect(() => {
    const init = async () => {
      await loadScript('https://telegram.org/js/telegram-web-app.js')

      const telegramInitData = isWebApp
        ? null
        : window.Telegram?.WebApp?.initData

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const data = {
    isValid,
    webApp: isValid ? window.Telegram.WebApp : null
  }

  return (
    <TelegramContext.Provider value={data}>
      {children(data)}
    </TelegramContext.Provider>
  )
}

export const useTelegram = (): TelegramData => useContext(TelegramContext)
