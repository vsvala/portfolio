import 'server-only'
import db from '@/lib/db'
import type { Education } from '@/lib/types'

export async function getAllEducation(_lang?: string): Promise<Education[]> {
  const result = await db.execute(
    `SELECT * FROM education ORDER BY sort_order ASC, created_at DESC`
  )
  return result.rows as unknown as Education[]
}

export async function getEducationById(id: number): Promise<Education | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM education WHERE id = ?`,
    args: [id],
  })
  return result.rows[0] as unknown as Education | undefined
}

export async function createEducation(
  data: Omit<Education, 'id' | 'created_at' | 'updated_at'>
): Promise<Education> {
  const result = await db.execute({
    sql: `INSERT INTO education
           (institution_fi, institution_en, degree_fi, degree_en,
            description_fi, description_en, start_date, end_date,
            document_id, sort_order)
         VALUES
           (:institution_fi, :institution_en, :degree_fi, :degree_en,
            :description_fi, :description_en, :start_date, :end_date,
            :document_id, :sort_order)`,
    args: data as Record<string, string | number | null>,
  })
  return (await getEducationById(Number(result.lastInsertRowid)))!
}

export async function updateEducation(
  id: number,
  data: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>
): Promise<Education | undefined> {
  await db.execute({
    sql: `UPDATE education SET
           institution_fi = COALESCE(:institution_fi, institution_fi),
           institution_en = COALESCE(:institution_en, institution_en),
           degree_fi      = COALESCE(:degree_fi,      degree_fi),
           degree_en      = COALESCE(:degree_en,      degree_en),
           description_fi = COALESCE(:description_fi, description_fi),
           description_en = COALESCE(:description_en, description_en),
           start_date     = COALESCE(:start_date,     start_date),
           end_date       = COALESCE(:end_date,       end_date),
           document_id    = COALESCE(:document_id,    document_id),
           sort_order     = COALESCE(:sort_order,     sort_order),
           updated_at     = datetime('now')
         WHERE id = :id`,
    args: Object.fromEntries(
      Object.entries({ ...data, id }).map(([k, v]) => [k, v === undefined ? null : v])
    ) as Record<string, string | number | null>,
  })
  return getEducationById(id)
}

export async function deleteEducation(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM education WHERE id = ?`, args: [id] })
}
