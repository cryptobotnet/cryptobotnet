import React from 'react'

import { LoaderIcon } from 'components/icons'

import styles from './styles.module.css'
import clsx from 'clsx'

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * handler for click event
   */
  onClick?: (event: React.MouseEvent) => void
  /**
   * button type
   */
  type?: 'primary' | 'secondary' | 'outline' | 'text'
  /**
   * button display type
   */
  display?: 'default' | 'rectangular'
  /**
   * button size
   */
  size?: 'tiny' | 'medium' | 'large'
  /**
   * whether the button takes 100% of parent width
   */
  block?: boolean
  /**
   * whether the button is round
   */
  round?: boolean
  /**
   * red color theme to attract attention
   */
  danger?: boolean
  /**
   * whether the button is disabled
   */
  disabled?: boolean
  /**
   * whether the button is in loading state
   */
  loading?: boolean
  /**
   * node for right icon
   */
  iconRight?: React.ReactNode
  /**
   * node for left icon
   */
  iconLeft?: React.ReactNode
  /**
   * additional CSS class
   */
  className?: string
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  type = 'primary',
  display = 'default',
  size = 'medium',
  block = false,
  round = false,
  danger = false,
  disabled = false,
  loading = false,
  iconRight = null,
  iconLeft = null,
  className,
  children,
  ...props
}) => (
  <button
    type="button"
    className={clsx(
      styles.button,
      styles[type],
      styles[display],
      styles[size],
      block && styles.block,
      round && styles.round,
      danger && styles.danger,
      disabled && styles.disabled,
      className
    )}
    {...(!disabled && !loading && onClick && { onClick })}
    {...props}>
    {!!iconLeft && !round && <div className={styles.iconLeft}>{iconLeft}</div>}

    {loading && type !== 'text' && round ? (
      <LoaderIcon className={styles.loader} />
    ) : (
      children
    )}

    {!!iconRight && !round && (
      <div className={styles.iconRight}>{iconRight}</div>
    )}

    {loading && !round && <LoaderIcon className={styles.loader} />}
  </button>
)
