import React from 'react'

import { useRouter } from 'next/router'

import styles from './styles.module.css'

export const Layout: React.FC<{ children: React.ReactElement }> = ({
  children
}) => {
  const { pathname } = useRouter()

  return (
    <div className={styles.layout}>
      <main key={pathname} className="global-appear">
        {children}
      </main>
    </div>
  )
}
