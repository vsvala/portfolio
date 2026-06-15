'use client'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ActionState } from '@/lib/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormAction = (prev: any, fd: FormData) => Promise<ActionState<any>>

export function useAdminForm(action: FormAction, redirectPath: string) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(action, { success: false, errors: {} } as ActionState)
  useEffect(() => {
    if (state?.success) router.push(redirectPath)
  }, [state, router, redirectPath])
  return { state, formAction, pending }
}
