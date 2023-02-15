import React from 'react'
import Head from 'next/head'

import { useRouter } from 'next/router'

const ORIGIN = process.env.NEXT_PUBLIC_ORIGIN

export interface MetaProps {
  title: string
  description: string
  type?: string
  imageUrl?: string
}

export const Meta: React.FC<MetaProps> = ({
  title,
  description,
  type,
  imageUrl
}) => {
  const { pathname } = useRouter()

  const canonicalUrl = `${ORIGIN}${pathname}`

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:url" content={canonicalUrl} />

      <title>{title}</title>
      <meta property="og:title" content={title} />

      <meta name="description" content={description} />
      <meta property="og:description" content={description} />

      <meta property="og:type" key="og:type" content={type || 'website'} />

      {imageUrl && (
        <meta property="og:image" key="og:image" content={imageUrl} />
      )}
    </Head>
  )
}
