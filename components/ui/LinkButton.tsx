'use client'
import Button from '@mui/material/Button'
import Link from 'next/link'
import type { ButtonProps } from '@mui/material/Button'

interface Props extends ButtonProps {
  href: string
}

export function LinkButton({ href, children, ...props }: Props) {
  return (
    <Button component={Link} href={href} {...props}>
      {children}
    </Button>
  )
}
