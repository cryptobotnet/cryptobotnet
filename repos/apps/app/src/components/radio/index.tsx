import React, { useMemo } from 'react'
import clsx from 'clsx'

import styles from './styles.module.css'

interface Option {
  value: string
  display: React.ReactNode
}

interface RadioProps {
  value: string | undefined
  onChange: (value: string) => void
  options: Option[]
  label?: string
  className?: string
}

export const Radio: React.FC<RadioProps> = ({
  value,
  onChange,
  options,
  label,
  className
}) => {
  const optionNodes = useMemo(
    () =>
      options.map(({ value: currentValue, display }) => (
        <div
          key={currentValue}
          onClick={() => onChange(currentValue)}
          className={clsx(
            styles.option,
            currentValue === value && styles.active
          )}>
          {display}
        </div>
      )),
    [options, onChange, value]
  )

  return (
    <div className={clsx(styles.container, className)}>
      {label && (
        <div className={styles.labelContainer}>
          {label && <label>{label}</label>}
        </div>
      )}
      {optionNodes}
    </div>
  )
}
