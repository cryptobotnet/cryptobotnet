import React from 'react'

import { Activity, Layers, Settings } from 'react-feather'

import styles from './styles.module.css'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { Link } from 'components/link'
import { Urls } from 'lib/urls'

const LINKS = [
  {
    label: 'Alerts',
    href: Urls.ALERTS,
    icon: <Activity />
  },
  {
    label: 'Positions',
    // href: Urls.POSITIONS,
    href: Urls.ADD_ALERT,
    icon: <Layers />
  },
  {
    label: 'API Keys',
    href: Urls.SETTINGS,
    icon: <Settings />
  }
]

export const Header: React.FC = () => {
  const { pathname } = useRouter()

  return (
    <header className={styles.header}>
      {LINKS.map(({ label, href, icon }) => (
        <Link
          href={href}
          key={href}
          className={clsx(
            styles.button,
            pathname.includes(href) && styles.active
          )}>
          {icon}
          {label}
        </Link>
      ))}
    </header>
  )
}
