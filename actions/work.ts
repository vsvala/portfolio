'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createWork, updateWork, deleteWork } from '@/lib/db/queries/work'
import { technologiesField } from '@/lib/zod-fields'
import { validationError } from '@/lib/action-utils'
import type { ActionState } from '@/lib/types'

const WorkSchema = z.object({
  company_name_fi: z.string().min(1),
  company_name_en: z.string().min(1),
  role_fi: z.string().min(1),
  role_en: z.string().min(1),
  description_fi: z.string().default(''),
  description_en: z.string().default(''),
  start_date: z.string().min(1),
  end_date: z.string().optional().nullable().transform((v) => v || null),
  technologies: technologiesField,
  certificate_document_id: z.coerce.number().nullable().optional().default(null),
  sort_order: z.coerce.number().default(0),
})

function revalidate() {
  revalidatePath('/work')
  revalidatePath('/admin/work')
}

export async function createWorkAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = WorkSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return validationError(parsed.error)
  }
  try {
    await createWork(parsed.data as Parameters<typeof createWork>[0])
    revalidate()
    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Tallennus epäonnistui / Save failed. Please try again.' }
  }
}

export async function updateWorkAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = WorkSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return validationError(parsed.error)
  }
  try {
    await updateWork(id, parsed.data)
    revalidate()
    return { success: true }
  } catch {
    return { success: false, errors: {}, message: 'Tallennus epäonnistui / Save failed. Please try again.' }
  }
}

export async function deleteWorkAction(id: number): Promise<void> {
  await requireAdmin()
  try {
    await deleteWork(id)
    revalidate()
  } catch (err) {
    console.error('deleteWorkAction failed:', err)
  }
}
