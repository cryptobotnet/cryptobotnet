import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'

import { getPositions } from 'api'
import { useTelegramWebApp } from 'context/telegram'
import { Urls } from 'lib/urls'

import { Spin } from 'components/spin'
import { Alert, Tag } from 'antd'
import Link from 'next/link'

// import styles from './styles.module.css'

export const Positions: NextPage = () => {
  const { WebApp } = useTelegramWebApp()

  const [loading, setLoading] = useState(true)
  const [positions, setPositions] = useState<any[]>([])
  const [configured, setConfigured] = useState<boolean>(false)

  const fetchIsConfigured = useCallback(async () => {
    const userId = WebApp?.initDataUnsafe.user?.id

    if (!userId) {
      setConfigured(false)

      return
    }

    setLoading(true)

    const { data, error } = await getPositions({ userId })

    if (!error) {
      setPositions(data)
    }

    setConfigured(!error)
    setLoading(false)
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

  return (
    <Spin loading={loading}>
      {configured === false ? (
        <Alert
          message="Not Configured"
          description={
            <>
              OKX API keys have not been configured. Please{' '}
              <Link href={Urls.SETTINGS}>configure your keys</Link> first.
            </>
          }
          type="info"
          className="global-appear"
        />
      ) : positionNodes.length ? (
        <>{positionNodes}</>
      ) : (
        <Tag className="global-appear">no open positions</Tag>
      )}
    </Spin>
  )
}

export default Positions
