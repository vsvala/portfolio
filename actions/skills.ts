'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createSkill, updateSkill, deleteSkill } from '@/lib/db/queries/skills'
import { validationError } from '@/lib/action-utils'
import type { ActionState } from '@/lib/types'

const CATEGORIES = ['frontend', 'backend', 'databases', 'tools', 'methods'] as const

const SkillSchema = z.object({
  category: z.enum(CATEGORIES),
  name: z.string().min(1),
  sort_order: z.coerce.number().default(0),
})

function revalidate() {
  revalidatePath('/')
  revalidatePath('/cv')
  revalidatePath('/admin/skills')
}

export async function createSkillAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = SkillSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return validationError(parsed.error)
  try {
    await createSkill(parsed.data)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Tallennus epäonnistui / Save failed. Please try again.' }
  }
}

export async function updateSkillAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = SkillSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return validationError(parsed.error)
  try {
    await updateSkill(id, parsed.data)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Tallennus epäonnistui / Save failed. Please try again.' }
  }
}

export async function deleteSkillAction(id: number): Promise<void> {
  await requireAdmin()
  try {
    await deleteSkill(id)
    revalidate()
  } catch (err) {
    console.error('deleteSkillAction failed:', err)
  }
}
