import React from 'react'

import { LoaderIcon } from 'components/icons'

import styles from './styles.module.css'

type Props = {
  loading: boolean
  children: React.ReactElement | React.ReactElement[]
}

export const Spin: React.FC<Props> = ({ loading, children }) =>
  loading ? (
    <LoaderIcon className={styles.spinner} />
  ) : (
    (children as React.ReactElement)
  )
