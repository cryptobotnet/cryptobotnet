import React, { useCallback, useEffect, useState } from 'react'
import type { NextPage } from 'next'

import { getPositions, setUserSecrets } from 'api'
import { useTelegramWebApp } from 'context/telegram'
import { useRouter } from 'next/router'
import { Urls } from 'lib/urls'

import { Spin } from 'components/spin'
import { Controller, useForm } from 'react-hook-form'
import { Form, Input, Alert, Typography } from 'antd'
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

  const router = useRouter()

  useEffect(() => {
    let timerId: number | null = null

    if (configured === true) {
      timerId = window.setTimeout(() => {
        router.push(Urls.POSITIONS)
      }, 4000)
    }

    return () => {
      if (timerId) {
        window.clearTimeout(timerId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configured])

  return (
    <Spin loading={loading}>
      {configured === true ? (
        <>
          <Alert
            message="Configuration Complete"
            description={
              <>
                Your OKX API keys have been configured, allowing you to receive
                alerts based on your account positions.
              </>
            }
            type="info"
            className={clsx(styles.alert, 'global-appear')}
          />

          <Alert
            description={
              <>
                You will now be redirected
                <Spin loading={true} />
              </>
            }
            type="info"
            className={clsx(styles.alert, styles.redirect, 'global-appear')}
          />
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
                <Typography.Text strong>@cryptopositionsbot</Typography.Text> is
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
