import 'server-only'
import db from '@/lib/db'
import type { WorkExperience } from '@/lib/types'

export async function getAllWork(_lang?: string): Promise<WorkExperience[]> {
  const result = await db.execute(
    `SELECT * FROM work_experience ORDER BY sort_order ASC, created_at DESC`
  )
  return result.rows as unknown as WorkExperience[]
}

export async function getWorkById(id: number): Promise<WorkExperience | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM work_experience WHERE id = ?`,
    args: [id],
  })
  return result.rows[0] as unknown as WorkExperience | undefined
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
           company_name_fi         = COALESCE(:company_name_fi,         company_name_fi),
           company_name_en         = COALESCE(:company_name_en,         company_name_en),
           role_fi                 = COALESCE(:role_fi,                 role_fi),
           role_en                 = COALESCE(:role_en,                 role_en),
           description_fi          = COALESCE(:description_fi,          description_fi),
           description_en          = COALESCE(:description_en,          description_en),
           start_date              = COALESCE(:start_date,              start_date),
           end_date                = COALESCE(:end_date,                end_date),
           technologies            = COALESCE(:technologies,            technologies),
           certificate_document_id = COALESCE(:certificate_document_id, certificate_document_id),
           sort_order              = COALESCE(:sort_order,              sort_order),
           updated_at              = datetime('now')
         WHERE id = :id`,
    args: Object.fromEntries(
      Object.entries({ ...data, id }).map(([k, v]) => [k, v === undefined ? null : v])
    ) as Record<string, string | number | null>,
  })
  return getWorkById(id)
}

export async function deleteWork(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM work_experience WHERE id = ?`, args: [id] })
}
