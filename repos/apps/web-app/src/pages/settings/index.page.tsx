import React, { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'

import { getPositions, setUserSecrets } from 'api'
import { useTelegramWebApp } from 'context/telegram'

import { Spin } from 'components/spin'
import { Controller, useForm } from 'react-hook-form'
import { Form, Input, Alert, Typography, Checkbox, Button } from 'antd'
import { Copyable } from 'components/copyable'

import styles from './styles.module.css'
import clsx from 'clsx'

interface FormValues {
  apiKey: string
  passphrase: string
  secretKey: string
}

export const Settings: NextPage = () => {
  const { WebApp } = useTelegramWebApp()

  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState<boolean>(false)

  const fetchIsConfigured = useCallback(async () => {
    const userId = WebApp?.initDataUnsafe.user?.id

    if (!userId) {
      setConfigured(false)

      return
    }

    setLoading(true)

    const { error } = await getPositions({ userId })

    setConfigured(!error)
    setLoading(false)
  }, [WebApp])

  useEffect(() => {
    fetchIsConfigured()
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [])

  const { formState, setError, control, handleSubmit } = useForm<FormValues>()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const handleMainClick = handleSubmit(
      async ({ apiKey, passphrase, secretKey }) => {
        const userId = WebApp?.initDataUnsafe.user?.id

        if (!userId) {
          WebApp?.HapticFeedback.notificationOccurred('error')
          setSubmitting(false)

          return
        }

        setSubmitting(true)
        WebApp?.MainButton.showProgress()

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

          WebApp?.MainButton.hideProgress()
          WebApp?.HapticFeedback.notificationOccurred('error')
          setSubmitting(false)

          return
        }

        await fetchIsConfigured()
        WebApp?.HapticFeedback.notificationOccurred('success')
      }
    )

    WebApp?.MainButton.setText('Provide API Keys')
    WebApp?.MainButton.onClick(handleMainClick)
    WebApp?.MainButton.hide()

    return () => {
      WebApp?.MainButton.offClick(handleMainClick)
      WebApp?.MainButton.hideProgress()
      WebApp?.MainButton.enable()
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

  return (
    <Spin loading={loading}>
      {configured === true ? (
        <>
          <Alert
            message="Configuration Complete"
            description={
              <>
                OKX API keys have been configured. You can receive alerts based
                on account positions.
              </>
            }
            type="info"
            className={clsx(styles.alert, 'global-appear')}
          />

          <Checkbox
            onChange={() => {
              WebApp?.HapticFeedback.impactOccurred('soft')
            }}
            className={styles.checkbox}>
            Auto alerts with open positions events
          </Checkbox>
          <Typography.Paragraph className={styles.example}>
            <pre>
              SHORT in SHIB-USDT-SWAP
              <br />
              just opened
              <br />
              <br />
              10 USDT x10 = 100 USDT
              <br />
              <br />
              Entry price = 0.00001181 USDT
            </pre>
          </Typography.Paragraph>

          <Checkbox
            onChange={() => {
              WebApp?.HapticFeedback.impactOccurred('soft')
            }}
            className={styles.checkbox}>
            Auto alerts with opens positions PnL
          </Checkbox>

          <Typography.Paragraph className={styles.example}>
            <pre>
              SHORT in SHIB-USDT-SWAP
              <br />
              just reached 10% or 2.56 USDT
            </pre>
          </Typography.Paragraph>

          <Button type="link" danger className={styles.remove}>
            Remove API Keys
          </Button>
        </>
      ) : (
        <>
          <Form
            layout="vertical"
            className={clsx(styles.form, 'global-appear')}>
            <Controller
              name="apiKey"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error, isDirty } }) => (
                <Form.Item
                // label="API Key"
                >
                  <Input.TextArea
                    value={field.value}
                    onChange={field.onChange}
                    className={styles.field}
                    placeholder="API Key"
                    rows={2}
                    // type="password"
                    disabled={submitting}
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
                  <Input.TextArea
                    value={field.value}
                    onChange={field.onChange}
                    className={styles.field}
                    placeholder="API Passphrase"
                    rows={2}
                    // type="password"
                    disabled={submitting}
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
                  <Input.TextArea
                    value={field.value}
                    onChange={field.onChange}
                    className={styles.field}
                    placeholder="API Secret"
                    rows={2}
                    // type="password"
                    disabled={submitting}
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
          </Form>

          <Alert
            message="How to get your okx.com API keys?"
            description={
              <>
                To obtain your okx.com API keys please refer this page (copy and
                paste in browser):
                <br />
                <br />
                <Copyable strong>https://okx.com/account/my-api</Copyable>
                <br />
                <br />
                Double check that issued API keys have{' '}
                <Typography.Text strong>read-permission only</Typography.Text>.
                Keys with write-permission allow trading and funding operations
                and that is not what this bot is supposed to do.
              </>
            }
            type="info"
            className={clsx(styles.alert, 'global-appear')}
          />

          <Alert
            description={
              <>
                <Typography.Text strong>@okxalertsbot</Typography.Text> is
                third-party open-source project and is not affiliated with
                okx.com team. Check out our code in case of any concerns:
                <br />
                <br />
                <Copyable strong>github.com/asyncink/okx-alerts-bot</Copyable>
              </>
            }
            type="info"
            className={clsx(styles.alert, 'global-appear')}
          />
        </>
      )}
    </Spin>
  )
}

export default Settings
