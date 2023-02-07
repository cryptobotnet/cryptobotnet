import React from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import Script from 'next/script'

import { ConfigProvider, theme } from 'antd'
import { Layout } from 'components/layout'

import 'lib/styles/global.css'
import 'lib/styles/variables.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  const telegramColorScheme =
    typeof window !== 'undefined' && window?.Telegram?.WebApp?.colorScheme

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Script src="https://telegram.org/js/telegram-web-app.js" />

      <ConfigProvider
        componentSize="large"
        theme={{
          algorithm:
            telegramColorScheme === 'dark'
              ? theme.darkAlgorithm
              : theme.defaultAlgorithm,
          token: {
            borderRadius: 40
          },
          components: {
            ...(telegramColorScheme === 'dark' && {
              Input: {
                colorBorder: 'transparent'
              }
            })
          }
        }}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ConfigProvider>
    </>
  )
}

export default App
