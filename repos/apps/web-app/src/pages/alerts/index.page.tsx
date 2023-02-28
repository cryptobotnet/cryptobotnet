import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'

import { useTelegramWebApp } from 'context/telegram'
import { useRouter } from 'next/router'
import type { Alert } from 'redis-client'
import { getAlerts, removeAlert } from 'api'
import { Urls } from 'lib/urls'
import numeral from 'numeral'
import throttle from 'lodash.throttle'

import { Spin } from 'components/spin'
import { Button, Tag } from 'antd'
import { Copyable } from 'components/copyable'
import { TrashIcon } from 'components/icons'

import styles from './styles.module.css'
import clsx from 'clsx'

export const Alerts: NextPage = () => {
  const { WebApp } = useTelegramWebApp()

  const router = useRouter()

  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  const removeLocalAlert = useCallback(
    ({ instrumentId, targetPrice }: Omit<Alert, 'userId'>) =>
      setAlerts(alerts =>
        alerts.filter(
          alert =>
            alert.instrumentId !== instrumentId ||
            alert.targetPrice !== targetPrice
        )
      ),
    []
  )

  const fetchAlerts = useCallback(async () => {
    const userId = WebApp?.initDataUnsafe.user?.id

    if (!userId) {
      return
    }

    setLoading(true)

    const { data, error } = await getAlerts({ userId })

    if (data && !error) {
      setAlerts(data)
    }

    setLoading(false)
  }, [WebApp])

  useEffect(() => {
    fetchAlerts()

    const clickHandler = () => {
      WebApp?.HapticFeedback.impactOccurred('light')
      router.push(Urls.ADD_ALERT)
    }

    WebApp?.MainButton.setText('Add price alert')
    WebApp?.MainButton.onClick(clickHandler)
    WebApp?.MainButton.show()

    return () => {
      WebApp?.MainButton.offClick(clickHandler)
      WebApp?.MainButton.hideProgress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sortedAlerts = useMemo(
    () =>
      alerts.sort(
        (alertA, alertB) =>
          alertA.instrumentId.localeCompare(alertB.instrumentId) ||
          alertB.targetPrice - alertA.targetPrice
      ),
    [alerts]
  )

  const [isRemoving, setIsRemoving] = useState(false)

  const handleRemoveClick = useCallback(
    ({ userId, instrumentId, targetPrice }: Alert) => {
      WebApp?.HapticFeedback.impactOccurred('light')

      WebApp?.showPopup(
        {
          title: 'Remove price alert?',
          message: `${instrumentId} ${numeral(targetPrice)
            .divide(1e8)
            .format('0,0[.][00000000]')
            .replace(',', ' ')}`,
          buttons: [
            {
              id: 'confirm',
              type: 'ok'
            },
            {
              id: 'cancel',
              type: 'cancel'
            }
          ]
        },
        async buttonId => {
          if (buttonId !== 'confirm') {
            WebApp?.HapticFeedback.impactOccurred('soft')

            return
          }

          WebApp?.MainButton.showProgress()

          setIsRemoving(true)

          WebApp?.HapticFeedback.impactOccurred('medium')

          await removeAlert({ userId, instrumentId, targetPrice })
          removeLocalAlert({ instrumentId, targetPrice })
          setIsRemoving(false)

          WebApp?.MainButton.hideProgress()
        }
      )
    },
    [WebApp, removeLocalAlert]
  )

  const alertNodes = useMemo(
    () =>
      sortedAlerts.map(({ userId, instrumentId, targetPrice }, index) => (
        <div
          key={`${instrumentId}${targetPrice}${index}`}
          className={clsx(styles.alert, 'global-appear')}>
          <Copyable className={styles.instrumentId}>{instrumentId}</Copyable>
          <Copyable className={styles.targetPrice}>
            {numeral(targetPrice)
              .divide(1e8)
              .format('0,0[.][00000000]')
              .replace(',', ' ')}
          </Copyable>
          <Button
            className={styles.remove}
            onClick={
              isRemoving
                ? undefined
                : () => handleRemoveClick({ userId, instrumentId, targetPrice })
            }
            disabled={isRemoving}
            type="link"
            icon={<TrashIcon />}
          />
        </div>
      )),
    [sortedAlerts, handleRemoveClick, isRemoving]
  )

  const toggleMainButton = throttle(
    event => {
      if (event.target !== event.currentTarget) {
        return
      }

      WebApp?.HapticFeedback.impactOccurred('soft')

      WebApp?.MainButton.isVisible
        ? WebApp?.MainButton.hide()
        : WebApp?.MainButton.show()
    },
    300,
    { trailing: false }
  )

  return (
    <section className={styles.page} onClick={toggleMainButton}>
      <Spin loading={loading}>
        {alertNodes.length ? alertNodes : <Tag>no active alerts</Tag>}
      </Spin>
    </section>
  )
}

export default Alerts
