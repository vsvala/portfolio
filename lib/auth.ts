import 'server-only'
import { redirect } from 'next/navigation'
import { decrypt, getSessionToken } from './session'
import type { SessionPayload } from './types'

export async function getSession(): Promise<SessionPayload | null> {
  const token = await getSessionToken()
  if (!token) return null
  return decrypt(token)
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    redirect('/admin/login')
  }
  return session
}