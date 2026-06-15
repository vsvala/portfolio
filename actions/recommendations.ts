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
): Promise<ActionState> {
  await requireAdmin()
  const parsed = RecommendationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return validationError(parsed.error)
  try {
    await createRecommendation(parsed.data)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Tallennus epäonnistui / Save failed. Please try again.' }
  }
}

export async function updateRecommendationAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = RecommendationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return validationError(parsed.error)
  try {
    await updateRecommendation(id, parsed.data)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Tallennus epäonnistui / Save failed. Please try again.' }
  }
}

export async function deleteRecommendationAction(id: number): Promise<void> {
  await requireAdmin()
  try {
    await deleteRecommendation(id)
    revalidate()
  } catch (err) {
    console.error('deleteRecommendationAction failed:', err)
  }
}
