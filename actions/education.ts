'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createEducation, updateEducation, deleteEducation } from '@/lib/db/queries/education'
import { validationError } from '@/lib/action-utils'
import type { ActionState } from '@/lib/types'

const EducationSchema = z.object({
  institution_fi: z.string().min(1),
  institution_en: z.string().min(1),
  degree_fi: z.string().min(1),
  degree_en: z.string().min(1),
  description_fi: z.string().default(''),
  description_en: z.string().default(''),
  start_date: z.string().min(1),
  end_date: z.string().optional().nullable().transform((v) => v || null),
  document_id: z.coerce.number().nullable().optional().default(null),
  sort_order: z.coerce.number().default(0),
})

function revalidate() {
  revalidatePath('/education')
  revalidatePath('/admin/education')
}

export async function createEducationAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState<{ id: number }>> {
  await requireAdmin()
  const parsed = EducationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return validationError(parsed.error)
  }
  const result = await createEducation(parsed.data as Parameters<typeof createEducation>[0])
  revalidate()
  return { success: true, data: { id: result.id } }
}

export async function updateEducationAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = EducationSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return validationError(parsed.error)
  }
  await updateEducation(id, parsed.data)
  revalidate()
  return { success: true }
}

export async function deleteEducationAction(id: number): Promise<void> {
  await requireAdmin()
  await deleteEducation(id)
  revalidate()
}
