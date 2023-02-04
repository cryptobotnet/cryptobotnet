import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'
import { copy } from '@typemodule/dom'

import { LoaderIcon, CopyIcon, SuccessIcon } from 'components/icons'
import { Button } from 'components/button'
import styles from './styles.module.css'

export interface InputProps {
  value?: string
  onChange?: (value: string) => void
  type?: 'text' | 'password'
  label?: React.ReactNode
  placeholder?: string
  sub?: React.ReactNode
  error?: string | boolean
  disabled?: boolean
  loading?: boolean
  inputMode?: React.HTMLProps<HTMLInputElement>['inputMode']
  pattern?: React.HTMLProps<HTMLInputElement>['pattern']
  autoComplete?: React.HTMLProps<HTMLInputElement>['autoComplete']
  withBorder?: boolean
  copyable?: boolean
  copyDisabled?: boolean
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value = '',
      onChange,
      type = 'text',
      label,
      placeholder,
      sub,
      error,
      disabled,
      loading,
      inputMode,
      pattern,
      autoComplete = 'off',
      withBorder,
      copyable,
      copyDisabled,
      className
    },
    ref
  ) => {
    const handleChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) =>
        onChange?.(event.target.value.trim()),
      [onChange]
    )

    const [copied, setCopied] = useState(false)

    const handleCopy = useCallback(async () => {
      try {
        await copy(value)
        setCopied(true)
      } catch {}
    }, [value])

    useEffect(() => {
      let timeoutId: number | null = null

      if (copied) {
        timeoutId = window.setTimeout(() => setCopied(false), 5000)
      }

      return () => {
        if (timeoutId) {
          window.clearTimeout(timeoutId)
        }
      }
    }, [copied])

    return (
      <div className={clsx(styles.container, error && styles.error, className)}>
        {(label || sub) && (
          <div className={styles.labelContainer}>
            {label && <label>{label}</label>}
            {sub && <div>{sub}</div>}
          </div>
        )}
        <div className={styles.inputContainer}>
          <input
            ref={ref}
            value={value}
            onChange={handleChange}
            type={type}
            placeholder={placeholder}
            disabled={disabled || loading}
            inputMode={inputMode}
            pattern={pattern}
            autoComplete={autoComplete}
            className={clsx(
              styles.input,
              withBorder && styles.withBorder,
              type === 'password' && styles.password
            )}
          />
          {loading && <LoaderIcon className={styles.loader} />}
          {copyable && !loading && (
            <Button
              type="text"
              onClick={handleCopy}
              className={clsx(
                styles.copyable,
                copyDisabled ? styles.disabled : styles.enabled
              )}
              disabled={copyDisabled}
              key={String(copied)}>
              {copied ? <SuccessIcon /> : <CopyIcon />}
            </Button>
          )}
        </div>
        {typeof error === 'string' && (
          <label className={styles.error}>{error}</label>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'
