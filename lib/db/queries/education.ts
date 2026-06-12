import 'server-only'
import db from '@/lib/db'
import type { Education } from '@/lib/types'

export function getAllEducation(_lang?: string): Education[] {
  return db
    .prepare(
      `SELECT * FROM education
       ORDER BY sort_order ASC, created_at DESC`
    )
    .all() as Education[]
}

export function getEducationById(id: number): Education | undefined {
  return db
    .prepare(`SELECT * FROM education WHERE id = ?`)
    .get(id) as Education | undefined
}

export function createEducation(
  data: Omit<Education, 'id' | 'created_at' | 'updated_at'>
): Education {
  const result = db
    .prepare(
      `INSERT INTO education
         (institution_fi, institution_en, degree_fi, degree_en,
          description_fi, description_en, start_date, end_date,
          document_id, sort_order)
       VALUES
         (@institution_fi, @institution_en, @degree_fi, @degree_en,
          @description_fi, @description_en, @start_date, @end_date,
          @document_id, @sort_order)`
    )
    .run(data)

  return getEducationById(result.lastInsertRowid as number)!
}

export function updateEducation(
  id: number,
  data: Partial<Omit<Education, 'id' | 'created_at' | 'updated_at'>>
): Education | undefined {
  db.prepare(
    `UPDATE education SET
       institution_fi = COALESCE(@institution_fi, institution_fi),
       institution_en = COALESCE(@institution_en, institution_en),
       degree_fi      = COALESCE(@degree_fi,      degree_fi),
       degree_en      = COALESCE(@degree_en,      degree_en),
       description_fi = COALESCE(@description_fi, description_fi),
       description_en = COALESCE(@description_en, description_en),
       start_date     = COALESCE(@start_date,     start_date),
       end_date       = COALESCE(@end_date,       end_date),
       document_id    = COALESCE(@document_id,    document_id),
       sort_order     = COALESCE(@sort_order,     sort_order),
       updated_at     = datetime('now')
     WHERE id = @id`
  ).run({ ...data, id })

  return getEducationById(id)
}

export function deleteEducation(id: number): void {
  db.prepare(`DELETE FROM education WHERE id = ?`).run(id)
}