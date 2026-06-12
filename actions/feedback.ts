'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createFeedback, markFeedbackRead, deleteFeedback } from '@/lib/db/queries/feedback'
import type { ActionState } from '@/lib/types'

const schema = z.object({
  target_type: z.enum(['work', 'project', 'education']),
  target_id: z.coerce.number(),
  target_title: z.string().max(200),
  message: z.string().min(5, 'Viesti on liian lyhyt').max(2000),
  sender_name: z.string().max(100).optional().transform(v => v || null),
  sender_email: z.string().email().max(200).optional().or(z.literal('')).transform(v => v || null),
  honeypot: z.string().max(0, 'Bot detected'),
})

export async function submitFeedback(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = schema.safeParse({
    target_type: formData.get('target_type'),
    target_id: formData.get('target_id'),
    target_title: formData.get('target_title'),
    message: formData.get('message'),
    sender_name: formData.get('sender_name'),
    sender_email: formData.get('sender_email'),
    honeypot: formData.get('honeypot') ?? '',
  })

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors as Record<string, string[]> }
  }

  const { honeypot: _h, ...data } = parsed.data
  await createFeedback(data)
  return { success: true }
}

export async function markReadAction(id: number): Promise<void> {
  await requireAdmin()
  await markFeedbackRead(id)
  revalidatePath('/admin/feedback')
}

export async function deleteFeedbackAction(id: number): Promise<void> {
  await requireAdmin()
  await deleteFeedback(id)
  revalidatePath('/admin/feedback')
}
