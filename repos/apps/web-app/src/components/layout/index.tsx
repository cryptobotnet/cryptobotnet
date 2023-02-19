import React from 'react'

import { useRouter } from 'next/router'

import { Header } from 'components/header'

import styles from './styles.module.css'

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const { pathname } = useRouter()

  return (
    <div className={styles.layout}>
      <Header />
      <main key={pathname}>{children}</main>
    </div>
  )
}
