'use server'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import type { ActionState } from '@/lib/types'

export async function login(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const password = formData.get('password') as string
  if (password !== process.env.ADMIN_PASSWORD) {
    return { success: false, errors: {}, message: 'Väärä salasana / Wrong password' }
  }
  await createSession()
  redirect('/admin')
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
