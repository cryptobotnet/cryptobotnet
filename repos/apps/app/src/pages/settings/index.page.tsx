import React from 'react'
import type { NextPage } from 'next'

import { Controller, useForm } from 'react-hook-form'
import { Form, Input, Alert, Typography } from 'antd'

import styles from './styles.module.css'

interface FormValues {
  apiKey: string
  passphrase: string
  apiSecret: string
}

export const Settings: NextPage = () => {
  const {
    // watch,
    // setValue,
    // reset,
    // setValue,
    // getValues,
    // setFocus,
    // setError,
    control
    // handleSubmit
  } = useForm<FormValues>({ reValidateMode: 'onSubmit' })

  return (
    <Form layout="vertical" className={styles.form}>
      <Controller
        name="apiKey"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Form.Item label="API Key">
            <Input
              value={field.value}
              onChange={field.onChange}
              className={styles.field}
            />
          </Form.Item>
        )}
      />

      <Controller
        name="apiKey"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Form.Item label="API Passphrase">
            <Input
              value={field.value}
              onChange={field.onChange}
              className={styles.field}
            />
          </Form.Item>
        )}
      />

      <Controller
        name="apiKey"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <Form.Item label="API Secret">
            <Input
              value={field.value}
              onChange={field.onChange}
              className={styles.field}
            />
          </Form.Item>
        )}
      />

      <Alert
        message="How to get your API keys"
        description={
          <>
            To obtain and configure API keys please refer this page on okx.com
            (copy and paste in your browser) —{' '}
            <Typography.Text strong copyable>
              https://www.okx.com/account/my-api
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
