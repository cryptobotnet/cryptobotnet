import React, { createContext, useContext, useEffect, useState } from 'react'

import { validateTelegram } from 'api'
import { loadScript } from 'lib/load-script'
import { isWebApp } from 'lib/is-web-app'

interface TelegramData {
  isValid: boolean
  webApp: {
    colorScheme: 'light' | 'dark'
  } | null
}

const initialData = {
  isValid: false,
  webApp: {
    colorScheme: 'light' as const
  }
}

const TelegramContext = createContext<TelegramData>(initialData)

export const TelegramProvider: React.FC<{
  children: (data: TelegramData) => React.ReactNode
}> = ({ children }) => {
  const [isValid, setIsValid] = useState(false)

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
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const data = {
    isValid,
    webApp: isWebApp ? window.Telegram.WebApp : null
  }

  return (
    <TelegramContext.Provider value={data}>
      {children(data)}
    </TelegramContext.Provider>
  )
}

export const useWebApp = (): TelegramData => useContext(TelegramContext)
