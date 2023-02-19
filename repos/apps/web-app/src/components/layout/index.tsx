import React from 'react'

import { useRouter } from 'next/router'

import { Header } from 'components/header'

import styles from './styles.module.css'

export const Layout: React.FC<{ children: React.ReactElement }> = ({
  children
}) => {
  const { pathname } = useRouter()

  return (
    <div className={styles.layout}>
      <Header />
      <main key={pathname} className="global-appear">
        {children}
      </main>
    </div>
  )
}
