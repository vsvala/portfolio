'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createProject, updateProject, deleteProject } from '@/lib/db/queries/projects'
import { technologiesField } from '@/lib/zod-fields'
import { validationError } from '@/lib/action-utils'
import type { ActionState } from '@/lib/types'

const ProjectSchema = z.object({
  title_fi: z.string().min(1),
  title_en: z.string().min(1),
  description_fi: z.string().default(''),
  description_en: z.string().default(''),
  long_description_fi: z.string().default(''),
  long_description_en: z.string().default(''),
  technologies: technologiesField,
  url: z.string().url().optional().nullable().or(z.literal('')),
  repo_url: z.string().url().optional().nullable().or(z.literal('')),
  category: z.string().default('hackathon'),
  document_id: z.coerce.number().nullable().optional().default(null),
  sort_order: z.coerce.number().default(0),
})

function revalidate() {
  revalidatePath('/projects')
  revalidatePath('/admin/projects')
}

export async function createProjectAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState<{ id: number }>> {
  await requireAdmin()
  const parsed = ProjectSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return validationError(parsed.error)
  }
  const data = { ...parsed.data, url: parsed.data.url || null, repo_url: parsed.data.repo_url || null }
  const result = await createProject(data as Parameters<typeof createProject>[0])
  revalidate()
  return { success: true, data: { id: result.id } }
}

export async function updateProjectAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = ProjectSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return validationError(parsed.error)
  }
  const data = { ...parsed.data, url: parsed.data.url || null, repo_url: parsed.data.repo_url || null }
  await updateProject(id, data)
  revalidate()
  return { success: true }
}

export async function deleteProjectAction(id: number): Promise<void> {
  await requireAdmin()
  await deleteProject(id)
  revalidate()
}
