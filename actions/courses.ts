'use server'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { createCourse, updateCourse, deleteCourse } from '@/lib/db/queries/courses'
import type { ActionState } from '@/lib/types'

const CourseSchema = z.object({
  name_fi: z.string().min(1),
  name_en: z.string().min(1),
  institution_fi: z.string().min(1),
  institution_en: z.string().min(1),
  category: z.string().min(1),
  credits: z.coerce.number().nullable().optional().default(null),
  year: z.coerce.number().nullable().optional().default(null),
  description_fi: z.string().default(''),
  description_en: z.string().default(''),
  url: z.string().url().optional().nullable().transform((v) => v || null),
  education_id: z.coerce.number().nullable().optional().default(null),
  sort_order: z.coerce.number().default(0),
})

function revalidate() {
  revalidatePath('/courses')
  revalidatePath('/admin/courses')
}

export async function createCourseAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState<{ id: number }>> {
  await requireAdmin()
  const parsed = CourseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }
  const id = await createCourse(parsed.data as Parameters<typeof createCourse>[0])
  revalidate()
  return { success: true, data: { id } }
}

export async function updateCourseAction(
  id: number,
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin()
  const parsed = CourseSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors }
  }
  await updateCourse(id, parsed.data as Parameters<typeof updateCourse>[1])
  revalidate()
  return { success: true }
}

export async function deleteCourseAction(id: number): Promise<void> {
  await requireAdmin()
  await deleteCourse(id)
  revalidate()
}
