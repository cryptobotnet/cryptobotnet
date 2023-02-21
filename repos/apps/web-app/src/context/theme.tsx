import React, { useMemo } from 'react'

import { useTelegramWebApp } from 'context/telegram'
import color from 'color'

import { ConfigProvider, theme as defaultTheme } from 'antd'

export const TelegramTheme: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { WebApp } = useTelegramWebApp()

  const theme = useMemo(() => {
    if (!WebApp) {
      return {}
    }

    const { colorScheme, themeParams } = WebApp
    const { bg_color, text_color, button_color } = themeParams

    const telegramBackgroundColor = color(bg_color)
    const telegramPrimaryColor = color(button_color)
    const telegramTextColor = color(text_color)

    return {
      telegramPrimaryColor: telegramPrimaryColor.hex(),

      inputBackgroundColor:
        colorScheme === 'light'
          ? telegramPrimaryColor.mix(color('white'), 0.85).hex()
          : telegramBackgroundColor.darken(0.3).hex(),

      inputBorderColor:
        colorScheme === 'light'
          ? telegramPrimaryColor.mix(color('white'), 0.65).hex()
          : telegramBackgroundColor.lighten(0.6).hex(),

      alertBackgroundColor:
        colorScheme === 'light'
          ? telegramPrimaryColor.mix(color('white'), 0.85).hex()
          : telegramBackgroundColor.lighten(0.2).hex(),

      alertBorderColor:
        colorScheme === 'light'
          ? telegramPrimaryColor.mix(color('white'), 0.8).hex()
          : telegramBackgroundColor.lighten(0.4).hex(),

      tinyIconColor:
        colorScheme === 'light'
          ? telegramTextColor.lighten(0.8).hex()
          : telegramTextColor.darken(0.4).hex(),

      tagBorderColor: telegramPrimaryColor.fade(0.4).toString(),
      tagColor: telegramPrimaryColor.hex()
    }
  }, [WebApp])

  const inputColors = {
    colorBgContainer: theme.inputBackgroundColor,
    colorBorder: theme.inputBorderColor
  }

  return (
    <ConfigProvider
      componentSize="large"
      theme={{
        algorithm:
          WebApp?.colorScheme === 'dark'
            ? defaultTheme.darkAlgorithm
            : defaultTheme.defaultAlgorithm,
        token: {
          borderRadius: 20,
          colorPrimary: theme.telegramPrimaryColor,
          colorInfo: theme.tinyIconColor
        },
        components: {
          Radio: {
            ...inputColors
          },
          Select: {
            ...inputColors,
            colorBgElevated: theme.inputBackgroundColor
          },
          InputNumber: {
            ...inputColors
          },
          Input: {
            ...inputColors
          },
          Alert: {
            colorInfoBg: theme.alertBackgroundColor,
            colorInfoBorder: theme.alertBorderColor
          },
          Tag: {
            colorBorder: theme.tagBorderColor,
            colorText: theme.tagColor
          },
          Button: {
            colorLink: theme.tinyIconColor
          }
        }
      }}>
      {children}
    </ConfigProvider>
  )
}
