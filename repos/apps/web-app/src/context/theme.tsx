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
      primaryFadedColor: telegramPrimaryColor.fade(0.8).toString(),

      inputBackgroundColor:
        colorScheme === 'light'
          ? telegramBackgroundColor.lighten(0.3).toString()
          : telegramBackgroundColor.darken(0.3).toString(),

      inputBorderColor:
        colorScheme === 'light'
          ? telegramBackgroundColor.darken(0.25).toString()
          : telegramBackgroundColor.lighten(0.6).toString(),

      alertBackgroundColor:
        colorScheme === 'light'
          ? telegramBackgroundColor.darken(0.025).toString()
          : telegramBackgroundColor.lighten(0.2).toString(),

      alertBorderColor:
        colorScheme === 'light'
          ? telegramBackgroundColor.darken(0.1).toString()
          : telegramBackgroundColor.lighten(0.4).toString(),

      tinyIconColor:
        colorScheme === 'light'
          ? telegramTextColor.lighten(0.8).toString()
          : telegramTextColor.darken(0.4).toString(),

      tagBorderColor: telegramPrimaryColor.fade(0.4).toString(),
      tagColor: telegramPrimaryColor.toString()
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
          colorPrimary: theme.primaryFadedColor,
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
