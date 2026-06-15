'use server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { deleteDocument } from '@/lib/db/queries/documents'

export async function deleteDocumentAction(id: number): Promise<void> {
  await requireAdmin()
  try {
    await deleteDocument(id)
    revalidatePath('/admin/documents')
  } catch (err) {
    console.error('deleteDocumentAction failed:', err)
  }
}
