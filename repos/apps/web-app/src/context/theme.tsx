import React, { useMemo } from 'react'

import { useTelegramWebApp } from 'context/telegram'
import color from 'color'

import { ConfigProvider, theme as defaultTheme } from 'antd'

export const TelegramTheme: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { WebApp } = useTelegramWebApp()

  const {
    primaryFadedColor,
    inputBackgroundColor,
    inputBorderColor,
    alertBackgroundColor,
    alertBorderColor,
    tinyIconColor,
    tagBorderColor,
    tagColor
  } = useMemo(() => {
    if (!WebApp) {
      return {}
    }

    const { colorScheme, themeParams } = WebApp
    const { bg_color, text_color, button_color } = themeParams

    const telegramBackgroundColor = color(bg_color)
    const telegramPrimaryColor = color(button_color)
    const telegramTextColor = color(text_color)

    const primaryFadedColor = telegramPrimaryColor.fade(0.8).toString()

    const inputBackgroundColor =
      colorScheme === 'light'
        ? telegramBackgroundColor.lighten(0.3).toString()
        : telegramBackgroundColor.darken(0.3).toString()

    const inputBorderColor =
      colorScheme === 'light'
        ? telegramBackgroundColor.darken(0.2).toString()
        : telegramBackgroundColor.lighten(0.6).toString()

    const alertBackgroundColor =
      colorScheme === 'light'
        ? telegramBackgroundColor.darken(0.025).toString()
        : telegramBackgroundColor.lighten(0.2).toString()

    const alertBorderColor =
      colorScheme === 'light'
        ? telegramBackgroundColor.darken(0.1).toString()
        : telegramBackgroundColor.lighten(0.4).toString()

    const tinyIconColor =
      colorScheme === 'light'
        ? telegramTextColor.lighten(0.8).toString()
        : telegramTextColor.darken(0.4).toString()

    const tagBorderColor = telegramPrimaryColor.fade(0.4).toString()
    const tagColor = telegramPrimaryColor.toString()

    return {
      primaryFadedColor,
      inputBackgroundColor,
      inputBorderColor,
      alertBackgroundColor,
      alertBorderColor,
      tinyIconColor,
      tagBorderColor,
      tagColor
    }
  }, [WebApp])

  const inputColors = {
    colorBgContainer: inputBackgroundColor,
    colorBorder: inputBorderColor
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
          colorPrimary: primaryFadedColor,
          colorInfo: tinyIconColor
        },
        components: {
          Radio: {
            ...inputColors
          },
          Select: {
            ...inputColors,
            colorBgElevated: inputBackgroundColor
          },
          InputNumber: {
            ...inputColors
          },
          Input: {
            ...inputColors
          },
          Alert: {
            colorInfoBg: alertBackgroundColor,
            colorInfoBorder: alertBorderColor
          },
          Tag: {
            colorBorder: tagBorderColor,
            colorText: tagColor
          },
          Button: {
            colorLink: tinyIconColor
          }
        }
      }}>
      {children}
    </ConfigProvider>
  )
}
