import "server-only";
import db from "@/lib/db";
import { mapRows, mapRow } from "@/lib/db/utils";
import type { PdfDocument } from "@/lib/types";

export async function getAllDocuments(): Promise<PdfDocument[]> {
  const result = await db.execute(`SELECT * FROM pdf_documents ORDER BY created_at DESC`);
  return mapRows<PdfDocument>(result.rows);
}

export async function getDocumentById(id: number): Promise<PdfDocument | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM pdf_documents WHERE id = ?`,
    args: [id],
  });
  return mapRow<PdfDocument | undefined>(result.rows[0]);
}

export async function createDocument(
  data: Omit<PdfDocument, "id" | "created_at">
): Promise<{ id: number }> {
  const result = await db.execute({
    sql: `INSERT INTO pdf_documents (filename, label_fi, label_en, document_type, file_size)
          VALUES (:filename, :label_fi, :label_en, :document_type, :file_size)`,
    args: data as Record<string, string | number | null>,
  });
  return { id: Number(result.lastInsertRowid) };
}

export async function deleteDocument(id: number): Promise<void> {
  await db.execute({
    sql: `DELETE FROM pdf_documents WHERE id = ?`,
    args: [id],
  });
}
