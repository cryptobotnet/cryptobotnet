import React, { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'

import {
  getPositions,
  getPositionAlertsEnabled,
  setPositionAlertsEnabled
} from 'api'
import { useTelegramWebApp } from 'context/telegram'
import { Urls } from 'lib/urls'

import { Spin } from 'components/spin'
import { Alert, Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/es/checkbox'
import Link from 'next/link'

import styles from './styles.module.css'

export const Positions: NextPage = () => {
  const { WebApp } = useTelegramWebApp()

  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState<boolean>(false)
  const [enabled, setEnabled] = useState(false)

  const fetchIsConfigured = useCallback(async () => {
    const userId = WebApp?.initDataUnsafe.user?.id

    if (!userId) {
      setConfigured(false)

      return
    }

    setLoading(true)

    const { error } = await getPositions({ userId })

    if (!error) {
      setConfigured(!error)

      const { data } = await getPositionAlertsEnabled({ userId })

      setEnabled(data?.enabled === '1')
    }

    setLoading(false)
  }, [WebApp])

  useEffect(() => {
    WebApp?.MainButton.hide()

    fetchIsConfigured()
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  const onCheck = useCallback(
    async (event: CheckboxChangeEvent) => {
      const userId = WebApp?.initDataUnsafe.user?.id

      if (!userId) {
        return
      }

      setEnabled(event.target.checked)
      await setPositionAlertsEnabled({
        userId,
        enabled: event.target.checked ? '1' : '0'
      })
    },
    [WebApp]
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
      ) : (
        <Alert
          message="API Keys Configured"
          description={
            <>
              <p>
                Now you can receive alerts for account position events.
                Supported events:
              </p>
              <ul>
                <li>position opened</li>
                <li>position PnL crossed </li>
                <li>position closed</li>
              </ul>
              <Checkbox
                checked={enabled}
                onChange={onCheck}
                className={styles.checkbox}>
                Receive account position alerts
              </Checkbox>
            </>
          }
          type="info"
          className="global-appear"
        />
      )}
    </Spin>
  )
}

export default Positions
