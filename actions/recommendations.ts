'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createRecommendation, updateRecommendation, deleteRecommendation } from '@/lib/db/queries/recommendations'
import { validationError } from '@/lib/action-utils'
import type { ActionState } from '@/lib/types'

const RecommendationSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().default(''),
  relationship: z.string().default(''),
  rec_date: z.string().min(1),
  text: z.string().min(1),
  sort_order: z.coerce.number().default(0),
})

function revalidate() {
  revalidatePath('/recommendations')
  revalidatePath('/admin/recommendations')
}

export async function createRecommendationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState<{ id: number }>> {
  await requireAdmin()
  const parsed = RecommendationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return validationError(parsed.error)
  const result = await createRecommendation(parsed.data)
  revalidate()
  return { success: true, data: { id: result.id } }
}

export async function updateRecommendationAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = RecommendationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return validationError(parsed.error)
  await updateRecommendation(id, parsed.data)
  revalidate()
  return { success: true }
}

export async function deleteRecommendationAction(id: number): Promise<void> {
  await requireAdmin()
  await deleteRecommendation(id)
  revalidate()
}
