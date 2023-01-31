import React from 'react'
import type { AppProps } from 'next/app'

import Head from 'next/head'

import { Layout } from 'components/layout'

import 'lib/styles/global.css'
import 'lib/styles/variables.css'

const App: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

export default App
