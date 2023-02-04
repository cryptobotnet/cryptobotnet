import React from 'react'
import type { NextPage } from 'next'

import { TestComponent } from 'components/test-component'

export const Home: NextPage = () => {
  return (
    <>
      <TestComponent />
    </>
  )
}

export default Home
