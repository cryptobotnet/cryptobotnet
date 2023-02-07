import React, { useMemo } from 'react'
import type { NextPage } from 'next'

import { InstrumentType } from 'api'
// import { Urls } from 'lib/urls'
import numeral from 'numeral'

// import Link from 'next/link'
// import { Button } from 'antd'
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
          <div className={styles.instrumentId}>{instrumentId}</div>
          <div className={styles.targetPrice}>
            {numeral(targetPrice).format('0,0[.][00000000]').replace(',', ' ')}
          </div>
          <button className={styles.remove}>
            <TrashIcon />
          </button>
        </div>
      )),
    [sortedAlerts]
  )

  return (
    <>
      {alertNodes}

      {/* <Link href={Urls.ADD_ALERT}>
        <Button className={styles.add}>Add Alert</Button>
      </Link> */}
    </>
  )
}

export default Alerts
