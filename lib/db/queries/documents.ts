import 'server-only'
import db from '@/lib/db'
import type { PdfDocument } from '@/lib/types'

export async function getAllDocuments(): Promise<PdfDocument[]> {
  const result = await db.execute(
    `SELECT * FROM pdf_documents ORDER BY created_at DESC`
  )
  return result.rows as unknown as PdfDocument[]
}

export async function getDocumentById(id: number): Promise<PdfDocument | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM pdf_documents WHERE id = ?`,
    args: [id],
  })
  return result.rows[0] as unknown as PdfDocument | undefined
}

export async function createDocument(
  data: Omit<PdfDocument, 'id' | 'created_at'>
): Promise<PdfDocument> {
  const result = await db.execute({
    sql: `INSERT INTO pdf_documents (filename, label_fi, label_en, document_type, file_size)
          VALUES (:filename, :label_fi, :label_en, :document_type, :file_size)`,
    args: data as Record<string, string | number | null>,
  })
  return (await getDocumentById(Number(result.lastInsertRowid)))!
}

export async function deleteDocument(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM pdf_documents WHERE id = ?`, args: [id] })
}
