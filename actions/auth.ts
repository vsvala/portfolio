'use server'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { timingSafeEqual, createHash } from 'crypto'
import type { ActionState } from '@/lib/types'

function safeCompare(a: string, b: string): boolean {
  const hashA = createHash('sha256').update(a).digest()
  const hashB = createHash('sha256').update(b).digest()
  return timingSafeEqual(hashA, hashB)
}

export async function login(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = formData.get('password') as string
  if (!safeCompare(password, process.env.ADMIN_PASSWORD ?? '')) {
    return { success: false, errors: {}, message: 'Väärä salasana / Wrong password' }
  }
  await createSession()
  redirect('/admin')
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
