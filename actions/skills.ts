'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createSkill, updateSkill, deleteSkill } from '@/lib/db/queries/skills'
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
): Promise<ActionState<{ id: number }>> {
  await requireAdmin()
  const parsed = SkillSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }
  const result = await createSkill(parsed.data)
  revalidate()
  return { success: true, data: { id: result.id } }
}

export async function updateSkillAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = SkillSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { success: false, errors: parsed.error.flatten().fieldErrors }
  await updateSkill(id, parsed.data)
  revalidate()
  return { success: true }
}

export async function deleteSkillAction(id: number): Promise<void> {
  await requireAdmin()
  await deleteSkill(id)
  revalidate()
}
