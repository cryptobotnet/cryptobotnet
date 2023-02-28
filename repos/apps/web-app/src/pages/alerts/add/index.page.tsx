import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'

import { useTelegramWebApp } from 'context/telegram'
import { useRouter } from 'next/router'
import { addAlert, getTickers, InstrumentType } from 'api'
import { Urls } from 'lib/urls'

import { Controller, useForm } from 'react-hook-form'
import { Select, Input, Form, Checkbox } from 'antd'

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
    setError,
    trigger,
    formState,
    control,
    handleSubmit
  } = useForm<FormValues>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      instrumentType: InstrumentType.SPOT
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
              label: instId.replace('-', ' ⇄ ')
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

  useEffect(() => {
    if (!instrumentId) {
      setValue('targetPrice', undefined)

      return
    }

    const last = instrumentsReduced[instrumentType][instrumentId]?.last

    if (last) {
      setValue('targetPrice', last)
      trigger()
    }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [instrumentId])

  const handleFilterOption = useCallback(
    (inputValue: string, option: Instrument | undefined) => {
      const regexp = new RegExp(inputValue.replace(/\W/g, ''), 'i')

      return !!option && regexp.test(option.instId.replace(/\W/g, ''))
    },
    []
  )

  const handleFilterSort = useCallback(
    (optionA: Instrument, optionB: Instrument) =>
      (optionA.value ?? '')
        .toLowerCase()
        .localeCompare((optionB.value ?? '').toLowerCase()),
    []
  )

  const [searchValue, setSearchValue] = useState('')
  const [shouldClose, setShouldClose] = useState(true)

  const { WebApp } = useTelegramWebApp()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleMainClick = () => {
      WebApp?.HapticFeedback.impactOccurred('light')
      handleSubmit(async ({ instrumentId, targetPrice: targetPriceString }) => {
        const userId = WebApp?.initDataUnsafe.user?.id

        if (!userId || !instrumentId || !targetPriceString) {
          WebApp?.HapticFeedback.notificationOccurred('error')
          setLoading(false)

          return
        }

        setLoading(true)
        WebApp?.MainButton.showProgress()

        /* NOTE: multiply by 1e8 to avoid float numbers with high precision */
        const targetPrice = Math.trunc(Number(targetPriceString) * 1e8)

        const { error } = await addAlert({
          userId,
          instrumentId,
          targetPrice
        })

        if (error) {
          setError('instrumentId', {})
          setError('targetPrice', {})

          WebApp?.MainButton.hideProgress()
          WebApp?.HapticFeedback.notificationOccurred('error')
          setLoading(false)

          return
        }

        WebApp?.HapticFeedback.notificationOccurred('success')

        if (shouldClose) {
          WebApp?.close()
        } else {
          router.push(Urls.ALERTS)
        }
      })()
    }

    WebApp?.MainButton.onClick(handleMainClick)

    return () => {
      WebApp?.MainButton.offClick(handleMainClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldClose])

  useEffect(() => {
    const handleBackClick = () => router.push(Urls.ALERTS)

    WebApp?.MainButton.setText('Confirm')

    WebApp?.MainButton.hide()

    WebApp?.BackButton.onClick(handleBackClick)
    WebApp?.BackButton.show()

    document.body.style.overflow = 'hidden'

    return () => {
      WebApp?.MainButton.hideProgress()
      WebApp?.MainButton.enable()

      WebApp?.BackButton.offClick(handleBackClick)
      WebApp?.BackButton.hide()

      document.body.style.overflow = 'auto'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (formState.isDirty && formState.isValid && !formState.isSubmitting) {
      WebApp?.MainButton.hideProgress()
      WebApp?.MainButton.show()
    } else {
      WebApp?.MainButton.hide()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState])

  // const hapticFeedback = useCallback(
  //   () => WebApp?.HapticFeedback.impactOccurred('light'),
  //   [WebApp]
  // )

  return (
    <Form layout="vertical" className={styles.page}>
      {/* <Controller
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
              disabled={loading}
              optionType="button"
              buttonStyle="solid"
            />
          </Form.Item>
        )}
      /> */}

      <Controller
        name="instrumentId"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error, isDirty } }) => (
          <Form.Item>
            <Select
              open={!!searchValue && !field.value}
              onSearch={setSearchValue}
              value={field.value}
              onChange={value => {
                field.onChange(value)
                setSearchValue('')
              }}
              options={instruments[instrumentType]}
              loading={!instruments[instrumentType].length}
              showArrow={!instruments[instrumentType].length}
              filterOption={handleFilterOption}
              filterSort={handleFilterSort}
              placeholder="Start typing the ticker (e.g. BTC)"
              notFoundContent="No matching asset"
              showSearch
              allowClear
              className={styles.instrumentId}
              disabled={loading}
              status={
                (formState.isSubmitted && !formState.isValid) ||
                (error && !isDirty)
                  ? 'error'
                  : undefined
              }
            />
          </Form.Item>
        )}
      />

      {instrumentId && (
        <>
          <Controller
            name="targetPrice"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error, isDirty } }) => (
              <Form.Item>
                <Input
                  value={field.value}
                  onChange={event => {
                    const value = event.target.value

                    if (value === '' || /^\d+\.?\d{0,8}$/.test(value)) {
                      field.onChange(value)
                    }
                  }}
                  placeholder="Select target price"
                  className={styles.targetPrice}
                  disabled={loading}
                  status={
                    (formState.isSubmitted && !formState.isValid) ||
                    (error && !isDirty)
                      ? 'error'
                      : undefined
                  }
                />
              </Form.Item>
            )}
          />

          <Checkbox
            checked={shouldClose}
            onChange={event => setShouldClose(event.target.checked)}
            disabled={loading}
            className={styles.shouldClose}>
            Close this window once the alert is set
          </Checkbox>
        </>
      )}
    </Form>
  )
}

export default AddAlert
