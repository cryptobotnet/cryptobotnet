import React from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'

import { ConfigProvider, theme } from 'antd'
import { TelegramProvider } from 'context/telegram'
import { NoAccess } from 'components/no-access'
import { Layout } from 'components/layout'

import 'lib/styles/global.css'
import 'lib/styles/variables.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </Head>

      <TelegramProvider>
        {({ isValid, WebApp }) =>
          isValid === null ? null : isValid ? (
            <ConfigProvider
              componentSize="large"
              theme={{
                algorithm:
                  WebApp?.colorScheme === 'dark'
                    ? theme.darkAlgorithm
                    : theme.defaultAlgorithm,
                token: {
                  borderRadius: 40
                }
                // components: {
                //   ...(telegramColorScheme === 'dark' && {
                //     Input: {
                //       colorBorder: 'transparent'
                //     },
                //     InputNumber: {
                //       colorBorder: 'transparent'
                //     },
                //     Select: {
                //       colorBorder: 'transparent'
                //     }
                //   })
                // }
              }}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ConfigProvider>
          ) : (
            <NoAccess />
          )
        }
      </TelegramProvider>
    </>
  )
}

export default App
