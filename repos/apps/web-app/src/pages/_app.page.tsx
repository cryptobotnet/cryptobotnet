import React from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'

import { TelegramProvider } from 'context/telegram'
import { TelegramTheme } from 'context/theme'
import { Layout } from 'components/layout'
import { NoAccess } from 'components/no-access'

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
        {({ isValid }) =>
          isValid === null ? null : isValid ? (
            <TelegramTheme>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </TelegramTheme>
          ) : (
            <NoAccess />
          )
        }
      </TelegramProvider>
    </>
  )
}

export default App
