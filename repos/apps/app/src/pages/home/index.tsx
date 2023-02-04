import React from 'react'
import type { NextPage } from 'next'

import { Controller, useForm } from 'react-hook-form'

import { Radio } from 'components/radio'
import { Input } from 'components/input'

import styles from './styles.module.css'

enum InstrumentType {
  SPOT = 'spot',
  SWAP = 'swap'
}

interface FormValues {
  instrumentType: InstrumentType
  instId: string
  targetPrice: string
}

export const Home: NextPage = () => {
  const {
    // watch,
    // reset,
    // setValue,
    // getValues,
    // setFocus,
    // setError,
    control
    // handleSubmit
  } = useForm<FormValues>({ reValidateMode: 'onSubmit' })

  return (
    <>
      <Controller
        name="instrumentType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Radio
            value={field.value}
            onChange={field.onChange}
            label="Select asset type"
            className={styles.field}
            options={[
              {
                value: InstrumentType.SPOT,
                display: 'Spot Market'
              },
              {
                value: InstrumentType.SWAP,
                display: 'Perpetual Swap'
              }
            ]}
          />
        )}
      />

      <Controller
        name="instId"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            value={field.value}
            onChange={field.onChange}
            label="Select asset"
            placeholder="BTCUSDT"
            withBorder
            className={styles.field}
          />
        )}
      />

      <Controller
        name="targetPrice"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            value={field.value}
            onChange={field.onChange}
            label="Select target price"
            placeholder=""
            withBorder
            className={styles.field}
          />
        )}
      />
    </>
  )
}

export default Home
