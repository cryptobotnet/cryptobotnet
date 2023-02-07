import React from 'react'

import { Header } from 'components/header'

import styles from './styles.module.css'

export const Layout: React.FC = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main>{children}</main>
    </div>
  )
}
