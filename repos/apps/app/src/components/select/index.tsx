import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties
} from 'react'

import { useDelayedFlag } from '@typemodule/react'

import { ChevronDownIcon } from 'components/icons'

import styles from './styles.module.css'
import clsx from 'clsx'

interface Option {
  value: string
  display: React.ReactNode
  selectedDisplay?: React.ReactNode
  extra?: React.ReactNode
  disabled?: boolean
}

interface SelectProps {
  value: string | undefined
  onChange: (value: string) => void
  options: Option[]
  isOpenedOutside?: boolean
  closeOutside?: () => void
  label?: string
  placeholder?: string
  footer?: React.ReactNode
  disabled?: boolean
  className?: string
}

export const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  isOpenedOutside,
  closeOutside,
  label,
  placeholder,
  footer,
  disabled,
  className
}) => {
  const [isOpened, setIsOpened] = useState(false)

  const close = useCallback(() => setIsOpened(false), [])

  const toggle = useCallback(
    () => (disabled ? undefined : setIsOpened(isOpened => !isOpened)),
    [disabled]
  )

  const onOptionClick = useCallback(
    (value: string) => {
      onChange(value)
      close()
    },
    [onChange, close]
  )

  const onOverlayClick = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault()

      if (event.target !== event.currentTarget) {
        return
      }

      close()
    },
    [close]
  )

  const valueDisplay = useMemo(() => {
    const selectedOption = options.find(option => option.value === value)

    return (
      selectedOption?.selectedDisplay || selectedOption?.display || placeholder
    )
  }, [options, value, placeholder])

  const optionNodes = useMemo(
    () =>
      options.map(({ value, display, extra, disabled }) => (
        <div
          key={value}
          onClick={() => (disabled ? undefined : onOptionClick(value))}
          className={clsx(styles.option, disabled && styles.disabled)}>
          <div>{display}</div>
          <div className={styles.extra}>{extra}</div>
        </div>
      )),
    [options, onOptionClick]
  )

  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'visible'
      closeOutside?.()
    }

    return () => {
      document.body.style.overflow = 'visible'
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened])

  useEffect(() => {
    if (isOpenedOutside && !disabled) {
      setIsOpened(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenedOutside])

  const [dropdownStyles, setDropdownStyles] = useState<CSSProperties>({})

  const valueRef = useRef<HTMLDivElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const isOpenedDelayed = useDelayedFlag(isOpened, 100)

  useEffect(() => {
    const valueNode = valueRef.current
    const dropdownNode = dropdownRef.current

    if (!valueNode || !dropdownNode) {
      setDropdownStyles({})

      return
    }

    const valueBottom =
      window.pageYOffset + valueNode.getBoundingClientRect().bottom
    const dropdownHeight = dropdownNode.getBoundingClientRect().height
    const pageBottom = window.pageYOffset + window.innerHeight

    const position =
      valueBottom + dropdownHeight + 100 < pageBottom ? 'bottom' : 'top'

    const dropdownStyles =
      position === 'bottom'
        ? {
            top: 'calc(40px + 8px)',
            animationName: styles['dropdown-appear-top']
          }
        : {
            bottom: 'calc(40px + 8px)',
            animationName: styles['dropdown-appear-bottom']
          }

    setDropdownStyles(dropdownStyles)
  }, [isOpenedDelayed])

  return (
    <div className={clsx(styles.container, className)}>
      {label && (
        <div className={styles.labelContainer}>
          {label && <label>{label}</label>}
        </div>
      )}

      {isOpenedDelayed && (
        <div
          className={styles.overlay}
          onClick={onOverlayClick}
          style={{ opacity: isOpened ? 1 : 0 }}
        />
      )}

      <div
        onClick={toggle}
        ref={valueRef}
        className={clsx(styles.value, disabled && styles.disabled)}>
        <div className={styles.valueDisplay}>{valueDisplay}</div>
        <ChevronDownIcon />
      </div>

      {isOpenedDelayed && (
        <div
          ref={dropdownRef}
          className={styles.dropdown}
          style={{ ...dropdownStyles, opacity: isOpened ? 1 : 0 }}>
          {optionNodes}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      )}
    </div>
  )
}
