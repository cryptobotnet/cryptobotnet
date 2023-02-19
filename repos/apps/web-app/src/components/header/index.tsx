import React, { useCallback } from 'react'

import { useRouter } from 'next/router'
import { useTelegramWebApp } from 'context/telegram'
import { Urls } from 'lib/urls'

import { ActivityIcon, LayersIcon, SettingsIcon } from 'components/icons'
import Link from 'next/link'

import styles from './styles.module.css'
import clsx from 'clsx'

const LINKS = [
  {
    label: 'Alerts',
    href: Urls.ALERTS,
    icon: <ActivityIcon />
  },
  {
    label: 'Positions',
    // href: Urls.POSITIONS,
    href: Urls.POSITIONS,
    icon: <LayersIcon />
  },
  {
    href: Urls.SETTINGS,
    icon: <SettingsIcon />
  }
]

export const Header: React.FC = () => {
  const { pathname } = useRouter()
  const { WebApp } = useTelegramWebApp()

  const hapticFeedback = useCallback(
    () => WebApp?.HapticFeedback.impactOccurred('light'),
    [WebApp]
  )

  return (
    <header className={styles.header}>
      {LINKS.map(({ label, href, icon }) => (
        <Link
          href={href}
          key={href}
          onClick={hapticFeedback}
          className={clsx(styles.button, pathname === href && styles.active)}>
          {icon}
          {label && <span>{label}</span>}
        </Link>
      ))}
    </header>
  )
}
