import 'server-only'
import db from '@/lib/db'
import type { WorkExperience } from '@/lib/types'

export function getAllWork(_lang?: string): WorkExperience[] {
  return db
    .prepare(
      `SELECT * FROM work_experience
       ORDER BY sort_order ASC, created_at DESC`
    )
    .all() as WorkExperience[]
}

export function getWorkById(id: number): WorkExperience | undefined {
  return db
    .prepare(`SELECT * FROM work_experience WHERE id = ?`)
    .get(id) as WorkExperience | undefined
}

export function createWork(
  data: Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>
): WorkExperience {
  const result = db
    .prepare(
      `INSERT INTO work_experience
         (company_name_fi, company_name_en, role_fi, role_en,
          description_fi, description_en, start_date, end_date,
          technologies, certificate_document_id, sort_order)
       VALUES
         (@company_name_fi, @company_name_en, @role_fi, @role_en,
          @description_fi, @description_en, @start_date, @end_date,
          @technologies, @certificate_document_id, @sort_order)`
    )
    .run(data)

  return getWorkById(result.lastInsertRowid as number)!
}

export function updateWork(
  id: number,
  data: Partial<Omit<WorkExperience, 'id' | 'created_at' | 'updated_at'>>
): WorkExperience | undefined {
  db.prepare(
    `UPDATE work_experience SET
       company_name_fi       = COALESCE(@company_name_fi,       company_name_fi),
       company_name_en       = COALESCE(@company_name_en,       company_name_en),
       role_fi               = COALESCE(@role_fi,               role_fi),
       role_en               = COALESCE(@role_en,               role_en),
       description_fi        = COALESCE(@description_fi,        description_fi),
       description_en        = COALESCE(@description_en,        description_en),
       start_date            = COALESCE(@start_date,            start_date),
       end_date              = COALESCE(@end_date,              end_date),
       technologies          = COALESCE(@technologies,          technologies),
       certificate_document_id = COALESCE(@certificate_document_id, certificate_document_id),
       sort_order            = COALESCE(@sort_order,            sort_order),
       updated_at            = datetime('now')
     WHERE id = @id`
  ).run({ ...data, id })

  return getWorkById(id)
}

export function deleteWork(id: number): void {
  db.prepare(`DELETE FROM work_experience WHERE id = ?`).run(id)
}