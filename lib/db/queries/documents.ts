import 'server-only'
import db from '@/lib/db'
import type { PdfDocument } from '@/lib/types'

export function getAllDocuments(): PdfDocument[] {
  return db
    .prepare(`SELECT * FROM pdf_documents ORDER BY created_at DESC`)
    .all() as PdfDocument[]
}

export function getDocumentById(id: number): PdfDocument | undefined {
  return db
    .prepare(`SELECT * FROM pdf_documents WHERE id = ?`)
    .get(id) as PdfDocument | undefined
}

export function createDocument(
  data: Omit<PdfDocument, 'id' | 'created_at'>
): PdfDocument {
  const result = db
    .prepare(
      `INSERT INTO pdf_documents
         (filename, label_fi, label_en, document_type, file_size)
       VALUES
         (@filename, @label_fi, @label_en, @document_type, @file_size)`
    )
    .run(data)

  return getDocumentById(result.lastInsertRowid as number)!
}

export function deleteDocument(id: number): void {
  db.prepare(`DELETE FROM pdf_documents WHERE id = ?`).run(id)
}