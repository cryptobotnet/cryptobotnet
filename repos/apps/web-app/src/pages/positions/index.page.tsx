import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'

import { getPositions } from 'api'
import { useTelegramWebApp } from 'context/telegram'
import { Urls } from 'lib/urls'

import { Alert, Spin, Tag } from 'antd'
import Link from 'next/link'

import styles from './styles.module.css'

export const Positions: NextPage = () => {
  const { WebApp } = useTelegramWebApp()

  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)
  const [positions, setPositions] = useState<any[]>([])

  const fetchIsConfigured = useCallback(async () => {
    const userId = WebApp?.initDataUnsafe.user?.id

    if (!userId) {
      setIsConfigured(false)

      return
    }

    const { data, error } = await getPositions({ userId })

    setIsConfigured(!error)

    if (!error) {
      setPositions(data)
    }
  }, [WebApp])

  useEffect(() => {
    WebApp?.MainButton.hide()

    fetchIsConfigured()
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  const positionNodes = useMemo(
    () => positions.map((item, index) => <div key={index}>{index}</div>),
    [positions]
  )

  return isConfigured === null ? (
    <Spin />
  ) : isConfigured === false ? (
    <Alert
      message="Not Configured"
      description={
        <>
          OKX API keys have not been configured. Please visit{' '}
          <Link href={Urls.SETTINGS}>API Keys section</Link>.
        </>
      }
      type="info"
    />
  ) : positionNodes.length ? (
    <>{positionNodes}</>
  ) : (
    <Tag color="processing" className={styles.tag}>
      no open positions
    </Tag>
  )
}

export default Positions
