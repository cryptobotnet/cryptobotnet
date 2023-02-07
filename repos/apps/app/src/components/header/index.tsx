import React from 'react'

import { useRouter } from 'next/router'
import { Urls } from 'lib/urls'

import { Activity, Layers, Settings } from 'react-feather'
import { Link } from 'components/link'

import styles from './styles.module.css'

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

  const telegramColorScheme =
    typeof window !== 'undefined' && window?.Telegram?.WebApp?.colorScheme

  return (
    <header className={styles.header}>
      {LINKS.map(({ label, href, icon }) => (
        <Link
          href={href}
          key={href}
          className={styles.button}
          style={
            pathname.includes(href)
              ? {
                  backgroundColor:
                    telegramColorScheme === 'dark' ? '#1668dc' : '#e6f4ff',
                  color: telegramColorScheme === 'dark' ? '#fff' : '#1677ff'
                }
              : {}
          }>
          {icon}
          {label}
        </Link>
      ))}
    </header>
  )
}
