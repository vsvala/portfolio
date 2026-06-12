import 'server-only'
import db from '@/lib/db'
import type { Project } from '@/lib/types'

export function getAllProjects(_lang?: string): Project[] {
  return db
    .prepare(
      `SELECT * FROM projects
       ORDER BY sort_order ASC, created_at DESC`
    )
    .all() as Project[]
}

export function getProjectById(id: number): Project | undefined {
  return db
    .prepare(`SELECT * FROM projects WHERE id = ?`)
    .get(id) as Project | undefined
}

export function createProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Project {
  const result = db
    .prepare(
      `INSERT INTO projects
         (title_fi, title_en, description_fi, description_en,
          long_description_fi, long_description_en, technologies,
          url, repo_url, document_id, sort_order)
       VALUES
         (@title_fi, @title_en, @description_fi, @description_en,
          @long_description_fi, @long_description_en, @technologies,
          @url, @repo_url, @document_id, @sort_order)`
    )
    .run(data)

  return getProjectById(result.lastInsertRowid as number)!
}

export function updateProject(
  id: number,
  data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
): Project | undefined {
  db.prepare(
    `UPDATE projects SET
       title_fi            = COALESCE(@title_fi,            title_fi),
       title_en            = COALESCE(@title_en,            title_en),
       description_fi      = COALESCE(@description_fi,      description_fi),
       description_en      = COALESCE(@description_en,      description_en),
       long_description_fi = COALESCE(@long_description_fi, long_description_fi),
       long_description_en = COALESCE(@long_description_en, long_description_en),
       technologies        = COALESCE(@technologies,        technologies),
       url                 = COALESCE(@url,                 url),
       repo_url            = COALESCE(@repo_url,            repo_url),
       document_id         = COALESCE(@document_id,         document_id),
       sort_order          = COALESCE(@sort_order,          sort_order),
       updated_at          = datetime('now')
     WHERE id = @id`
  ).run({ ...data, id })

  return getProjectById(id)
}

export function deleteProject(id: number): void {
  db.prepare(`DELETE FROM projects WHERE id = ?`).run(id)
}