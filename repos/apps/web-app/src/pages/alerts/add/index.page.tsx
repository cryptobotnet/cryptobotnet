import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'

import { useTelegramWebApp } from 'context/telegram'
import { useRouter } from 'next/router'
import { getTickers, InstrumentType } from 'api'
import { getNumberPrecision } from 'lib/get-number-precision'
import { Urls } from 'lib/urls'

import { Controller, useForm } from 'react-hook-form'
import { Radio, Select, InputNumber, Form } from 'antd'

import styles from './styles.module.css'

interface FormValues {
  instrumentType: InstrumentType
  instrumentId: string | undefined
  targetPrice: string | undefined
}

type Instrument = {
  instId: string
  last: string
  value: string
  label: string
}

export const AddAlert: NextPage = () => {
  const [instruments, setInstruments] = useState<
    Record<InstrumentType, Instrument[]>
  >({
    [InstrumentType.SPOT]: [],
    [InstrumentType.SWAP]: []
  })

  const {
    watch,
    setValue,
    // reset,
    // setValue,
    // getValues,
    // setFocus,
    // setError,
    formState,
    control,
    handleSubmit
  } = useForm<FormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      instrumentType: InstrumentType.SWAP
    }
  })

  const instrumentType = watch('instrumentType')

  useEffect(() => {
    setValue('instrumentId', undefined)
    setValue('targetPrice', undefined)

    /* NOTE: fetch tickers only once for each instrumentType */
    if (instruments[instrumentType].length === 0) {
      getTickers({ instType: instrumentType }).then(({ data, error }) => {
        if (data && !error) {
          setInstruments(instruments => ({
            ...instruments,
            [instrumentType]: data.map(({ instId, last }) => ({
              instId,
              last,
              value: instId,
              label: instId
            }))
          }))
        }
      })
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [instrumentType])

  const instrumentsReduced = useMemo(() => {
    const instrumentsReduced = {} as Record<
      InstrumentType,
      Record<string, Instrument>
    >

    for (const type in InstrumentType) {
      instrumentsReduced[type as InstrumentType] = instruments[
        type as InstrumentType
      ].reduce(
        (acc, element) => ({
          ...acc,
          [element.instId]: element
        }),
        {}
      )
    }

    return instrumentsReduced
  }, [instruments])

  const instrumentId = watch('instrumentId')

  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!instrumentId) {
      setValue('targetPrice', undefined)

      return
    }

    const last = instrumentsReduced[instrumentType][instrumentId]?.last

    if (last) {
      setValue('targetPrice', last)

      if (Number(last) > 10000) {
        setStep(10)
      } else if (Number(last) > 100) {
        setStep(1)
      } else {
        const precision = getNumberPrecision(Number(last))

        setStep(1 / Math.pow(10, precision))
      }
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [instrumentId])

  const handleFilterSort = useCallback(
    (optionA: Instrument, optionB: Instrument) =>
      (optionA.value ?? '')
        .toLowerCase()
        .localeCompare((optionB.value ?? '').toLowerCase()),
    []
  )

  const { WebApp } = useTelegramWebApp()
  const router = useRouter()

  useEffect(() => {
    const handleMainClick = () => {
      WebApp?.HapticFeedback.impactOccurred('light')
      handleSubmit(values => console.log(values))
    }
    const handleBackClick = () => router.push(Urls.ALERTS)

    WebApp?.MainButton.setText('Confirm')
    WebApp?.MainButton.onClick(handleMainClick)
    WebApp?.MainButton.show()

    WebApp?.BackButton.onClick(handleBackClick)
    window.setTimeout(() => WebApp?.MainButton.show(), 1000)

    return () => {
      WebApp?.MainButton.offClick(handleMainClick)
      WebApp?.MainButton.enable()
      WebApp?.MainButton.hide()

      WebApp?.BackButton.offClick(handleBackClick)
      WebApp?.BackButton.hide()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (formState.isValid) {
      WebApp?.MainButton.enable()
    } else {
      WebApp?.MainButton.disable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  const hapticFeedback = useCallback(
    () => WebApp?.HapticFeedback.impactOccurred('light'),
    [WebApp]
  )

  return (
    <Form layout="vertical" className={styles.page}>
      <Controller
        name="instrumentType"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Form.Item>
            <Radio.Group
              value={field.value}
              onChange={value => {
                field.onChange(value)
                hapticFeedback()
              }}
              options={[
                {
                  value: InstrumentType.SPOT,
                  label: 'Spot Market'
                },
                {
                  value: InstrumentType.SWAP,
                  label: 'Perpetual Swap'
                }
              ]}
              className={styles.instrumentType}
              optionType="button"
            />
          </Form.Item>
        )}
      />

      <Controller
        name="instrumentId"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Form.Item>
            <Select
              value={field.value}
              onChange={field.onChange}
              options={instruments[instrumentType]}
              loading={!instruments[instrumentType].length}
              showArrow={!instruments[instrumentType].length}
              filterSort={handleFilterSort}
              placeholder="Select asset"
              notFoundContent="No matching asset"
              showSearch
              allowClear
              className={styles.instrumentId}
            />
          </Form.Item>
        )}
      />

      <Controller
        name="targetPrice"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Form.Item>
            <InputNumber
              value={field.value}
              onChange={field.onChange}
              placeholder="Select target price"
              step={step}
              stringMode
              className={styles.targetPrice}
            />
          </Form.Item>
        )}
      />
    </Form>
  )
}

export default AddAlert
