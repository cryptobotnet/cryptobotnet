import React, { useCallback } from 'react'

import { useTelegramWebApp } from 'context/telegram'

import { Typography } from 'antd'
import { CopyIcon } from 'components/icons'

import styles from './styles.module.css'

export const Copyable: React.FC<{
  children: React.ReactNode
  strong?: boolean
  className?: string
}> = ({ children, strong, className }) => {
  const { WebApp } = useTelegramWebApp()

  const hapticFeedback = useCallback(
    () => WebApp?.HapticFeedback.impactOccurred('soft'),
    [WebApp]
  )

  return (
    <Typography.Text
      strong={strong}
      className={className}
      copyable={{
        tooltips: false,
        icon: <CopyIcon className={styles.icon} />,
        onCopy: hapticFeedback
      }}>
      {children}
    </Typography.Text>
  )
}
