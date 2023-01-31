import React from 'react'
import { default as LinkNext, type LinkProps as NextLinkProps } from 'next/link'

interface LinkProps extends Omit<React.HTMLProps<HTMLAnchorElement>, 'href'> {
  href: NextLinkProps['href']
  locale?: NextLinkProps['locale']
  scroll?: NextLinkProps['scroll']
  className?: string
}

export const Link: React.FC<LinkProps> = ({
  href,
  locale,
  scroll,
  children,
  ...props
}) => (
  <LinkNext href={href} locale={locale} scroll={scroll}>
    <a {...props}>{children}</a>
  </LinkNext>
)
