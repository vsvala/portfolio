import 'server-only'
import db from '@/lib/db'
import { toArgs } from '@/lib/db/utils'
import type { Project } from '@/lib/types'

export async function getAllProjects(): Promise<Project[]> {
  const result = await db.execute(
    `SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC`
  )
  return result.rows as unknown as Project[]
}

export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const result = await db.execute({
    sql: `SELECT * FROM projects WHERE category = ? ORDER BY sort_order ASC, created_at DESC`,
    args: [category],
  })
  return result.rows as unknown as Project[]
}

export async function getProjectById(id: number): Promise<Project | undefined> {
  const result = await db.execute({
    sql: `SELECT * FROM projects WHERE id = ?`,
    args: [id],
  })
  return result.rows[0] as unknown as Project | undefined
}

export async function createProject(
  data: Omit<Project, 'id' | 'created_at' | 'updated_at'>
): Promise<Project> {
  const result = await db.execute({
    sql: `INSERT INTO projects
           (title_fi, title_en, description_fi, description_en,
            long_description_fi, long_description_en, technologies,
            url, repo_url, category, document_id, sort_order)
         VALUES
           (:title_fi, :title_en, :description_fi, :description_en,
            :long_description_fi, :long_description_en, :technologies,
            :url, :repo_url, :category, :document_id, :sort_order)`,
    args: data as Record<string, string | number | null>,
  })
  return (await getProjectById(Number(result.lastInsertRowid)))!
}

export async function updateProject(
  id: number,
  data: Partial<Omit<Project, 'id' | 'created_at' | 'updated_at'>>
): Promise<Project | undefined> {
  await db.execute({
    sql: `UPDATE projects SET
           title_fi            = :title_fi,
           title_en            = :title_en,
           description_fi      = :description_fi,
           description_en      = :description_en,
           long_description_fi = :long_description_fi,
           long_description_en = :long_description_en,
           technologies        = :technologies,
           url                 = :url,
           repo_url            = :repo_url,
           category            = :category,
           document_id         = :document_id,
           sort_order          = :sort_order,
           updated_at          = datetime('now')
         WHERE id = :id`,
    args: toArgs(data as Record<string, unknown>, id),
  })
  return getProjectById(id)
}

export async function deleteProject(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM projects WHERE id = ?`, args: [id] })
}
