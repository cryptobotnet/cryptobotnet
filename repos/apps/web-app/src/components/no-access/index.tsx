import React from 'react'

import Image from 'next/image'
import logoImage from './loader.png'
import { Button } from 'antd'

import styles from './styles.module.css'

export const NoAccess: React.FC = () => (
  <div className={styles.container}>
    <Image
      src={logoImage}
      alt="okx alerts bot loader"
      placeholder="blur"
      className={styles.image}
    />

    <Button href="/" className={styles.button}>
      Go to Telegram
    </Button>
  </div>
)
