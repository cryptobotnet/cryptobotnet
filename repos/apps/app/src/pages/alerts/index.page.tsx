import React, { useCallback, useEffect, useMemo } from 'react'
import type { NextPage } from 'next'

import { useTelegramWebApp } from 'context/telegram'
import { useRouter } from 'next/router'
import { InstrumentType } from 'api'
import { Urls } from 'lib/urls'
import numeral from 'numeral'

import { Typography } from 'antd'
import { TrashIcon } from 'components/icons'

import styles from './styles.module.css'

const PRICE_ALERTS = [
  {
    instrumentType: InstrumentType.SPOT,
    instrumentId: 'SHIB-USDT-SWAP',
    targetPrice: '0.00001540'
  },
  {
    instrumentType: InstrumentType.SWAP,
    instrumentId: 'SHIB-USDT-SWAP',
    targetPrice: '0.00001942'
  },
  {
    instrumentType: InstrumentType.SPOT,
    instrumentId: 'BTC-USDT-SWAP',
    targetPrice: '26100.52'
  },
  {
    instrumentType: InstrumentType.SWAP,
    instrumentId: 'BTC-USDT-SWAP',
    targetPrice: '23520.76'
  }
]

export const Alerts: NextPage = () => {
  const { WebApp } = useTelegramWebApp()
  const router = useRouter()

  useEffect(() => {
    const clickHandler = () => router.push(Urls.ADD_ALERT)

    WebApp?.MainButton.setText('Add price alert')
    WebApp?.MainButton.onClick(clickHandler)
    WebApp?.MainButton.show()

    return () => {
      WebApp?.MainButton.offClick(clickHandler)
      WebApp?.MainButton.hide()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleMainButton = useCallback(
    event => {
      if (event.target !== event.currentTarget) {
        return
      }

      WebApp?.MainButton.isVisible
        ? WebApp?.MainButton.hide()
        : WebApp?.MainButton.show()
    },
    [WebApp]
  )

  const sortedAlerts = useMemo(
    () =>
      PRICE_ALERTS.sort(
        (alertA, alertB) =>
          alertA.instrumentId.localeCompare(alertB.instrumentId) ||
          parseFloat(alertB.targetPrice) - parseFloat(alertA.targetPrice)
      ),
    []
  )

  const alertNodes = useMemo(
    () =>
      sortedAlerts.map(({ instrumentId, targetPrice }) => (
        <div key={`${instrumentId}${targetPrice}`} className={styles.alert}>
          <Typography.Text
            className={styles.instrumentId}
            copyable={{ tooltips: false }}>
            {instrumentId}
          </Typography.Text>
          <Typography.Text
            className={styles.targetPrice}
            copyable={{ tooltips: false }}>
            {numeral(targetPrice).format('0,0[.][00000000]').replace(',', ' ')}
          </Typography.Text>
          <button className={styles.remove}>
            <TrashIcon />
          </button>
        </div>
      )),
    [sortedAlerts]
  )

  return (
    <section className={styles.page} onClick={toggleMainButton}>
      {alertNodes}

      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light')
          }>
          impactOccurred light
        </button>
      </div>
      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium')
          }>
          impactOccurred medium
        </button>
      </div>
      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy')
          }>
          impactOccurred heavy
        </button>
      </div>
      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.impactOccurred('rigid')
          }>
          impactOccurred rigid
        </button>
      </div>
      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.impactOccurred('soft')
          }>
          impactOccurred soft
        </button>
      </div>

      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.notificationOccurred('error')
          }>
          notificationOccurred error
        </button>
      </div>
      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.notificationOccurred(
              'success'
            )
          }>
          notificationOccurred success
        </button>
      </div>
      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.notificationOccurred(
              'warning'
            )
          }>
          notificationOccurred warning
        </button>
      </div>
      <div className={styles.button}>
        <button
          onClick={() =>
            window.Telegram.WebApp.HapticFeedback.selectionChanged()
          }>
          selectionChanged
        </button>
      </div>
    </section>
  )
}

export default Alerts
