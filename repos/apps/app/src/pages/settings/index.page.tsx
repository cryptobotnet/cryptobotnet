import React, { useCallback, useEffect, useMemo, useState } from 'react'
import type { NextPage } from 'next'

import { getPositions, setUserSecrets } from 'api'
import { useTelegram } from 'context/telegram'
import { Urls } from 'lib/urls'

import { Controller, useForm } from 'react-hook-form'
import Link from 'next/link'
import { Form, Input, Alert, Typography, Button, Spin } from 'antd'

import styles from './styles.module.css'

interface FormValues {
  apiKey: string
  passphrase: string
  secretKey: string
}

export const Settings: NextPage = () => {
  const { webApp } = useTelegram()

  const [isConfigured, setIsConfigured] = useState<boolean | null>(null)

  const fetchIsConfigured = useCallback(async () => {
    const userId = webApp?.initDataUnsafe.user?.id || 1
    const { error } = await getPositions({ userId })

    setIsConfigured(!error)
  }, [webApp])

  useEffect(() => {
    fetchIsConfigured()
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  const { formState, setError, control, handleSubmit } = useForm<FormValues>()
  const [loading, setLoading] = useState(false)

  const submit = useMemo(
    () =>
      handleSubmit(async ({ apiKey, passphrase, secretKey }) => {
        const userId = webApp?.initDataUnsafe.user?.id || 1

        if (!userId) {
          return
        }

        setLoading(true)

        const { error } = await setUserSecrets({
          userId,
          apiKey,
          passphrase,
          secretKey
        })

        if (error) {
          setError('apiKey', {})
          setError('passphrase', {})
          setError('secretKey', {})

          setLoading(false)

          return
        }

        fetchIsConfigured()
      }),
    [handleSubmit, webApp, setError, fetchIsConfigured]
  )

  return isConfigured === null ? (
    <Spin />
  ) : isConfigured === true ? (
    <Alert
      message="Configuration Complete"
      description={
        <>
          OKX API keys have been configured. You can receive alerts with account
          position events. Your open positions are listed in{' '}
          <Link href={Urls.POSITIONS}>Positions section</Link>.
        </>
      }
      type="success"
    />
  ) : (
    <Form layout="vertical" className={styles.form}>
      <Controller
        name="apiKey"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error, isDirty } }) => (
          <Form.Item
          // label="API Key"
          >
            <Input
              value={field.value}
              onChange={field.onChange}
              className={styles.field}
              placeholder="API Key"
              type="password"
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

      <Controller
        name="passphrase"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error, isDirty } }) => (
          <Form.Item
          // label="API Passphrase"
          >
            <Input
              value={field.value}
              onChange={field.onChange}
              className={styles.field}
              placeholder="API Passphrase"
              type="password"
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

      <Controller
        name="secretKey"
        control={control}
        rules={{ required: true }}
        render={({ field, fieldState: { error, isDirty } }) => (
          <Form.Item
          // label="API Secret"
          >
            <Input
              value={field.value}
              onChange={field.onChange}
              className={styles.field}
              placeholder="API Secret"
              type="password"
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

      <Button type="primary" block onClick={submit} loading={loading}>
        Save
      </Button>

      <Alert
        message="How to get your API keys"
        description={
          <>
            To obtain your API keys please refer this page on okx.com (copy and
            paste in browser):
            <br />
            <Typography.Text strong copyable>
              https://okx.com/account/my-api
            </Typography.Text>
          </>
        }
        type="info"
        className={styles.alert}
      />

      <Alert
        message="Read-Permission Only"
        description={
          <>
            Please check that you are issuing keys with{' '}
            <Typography.Text strong>read-permission only</Typography.Text>. Keys
            with write-permission allow trading and funding operations and that
            is not what this bot is supposed to do.
          </>
        }
        type="warning"
        className={styles.alert}
      />
    </Form>
  )
}

export default Settings
