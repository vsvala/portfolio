import 'server-only'
import db from '@/lib/db'
import { toArgs, mapRows, mapRow } from '@/lib/db/utils'
import type { WorkExperience } from '@/lib/types'

export async function getAllWork(): Promise<WorkExperience[]> {
  const result = await db.execute(
    `SELECT * FROM work_experience ORDER BY sort_order ASC, created_at DESC`
  )
  return mapRows<WorkExperience>(result.rows)
}

export async function getWorkById(id: number): Promise<WorkExperience | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM work_experience WHERE id = ?`,
    args: [id],
  })
  return mapRow<WorkExperience | undefined>(result.rows[0])
}

export async function createWork(
  data: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>
): Promise<WorkExperience> {
  const result = await db.execute({
    sql: `INSERT INTO work_experience
           (company_name_fi, company_name_en, role_fi, role_en,
            description_fi, description_en, start_date, end_date,
            technologies, certificate_document_id, sort_order)
         VALUES
           (:company_name_fi, :company_name_en, :role_fi, :role_en,
            :description_fi, :description_en, :start_date, :end_date,
            :technologies, :certificate_document_id, :sort_order)`,
    args: data as Record<string, string | number | null>,
  })
  return (await getWorkById(Number(result.lastInsertRowid)))!
}

export async function updateWork(
  id: number,
  data: Partial<Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>>
): Promise<WorkExperience | undefined> {
  await db.execute({
    sql: `UPDATE work_experience SET
           company_name_fi         = :company_name_fi,
           company_name_en         = :company_name_en,
           role_fi                 = :role_fi,
           role_en                 = :role_en,
           description_fi          = :description_fi,
           description_en          = :description_en,
           start_date              = :start_date,
           end_date                = :end_date,
           technologies            = :technologies,
           certificate_document_id = :certificate_document_id,
           sort_order              = :sort_order,
           updated_at              = datetime('now')
         WHERE id = :id`,
    args: toArgs(data as Record<string, unknown>, id),
  })
  return getWorkById(id)
}

export async function deleteWork(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM work_experience WHERE id = ?`, args: [id] })
}
