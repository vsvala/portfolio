import 'server-only'
import db from '@/lib/db'
import type { Skill } from '@/lib/types'

export async function getAllSkills(): Promise<Skill[]> {
  const result = await db.execute(`SELECT * FROM skills ORDER BY sort_order ASC`)
  return result.rows as unknown as Skill[]
}

export async function getSkillById(id: number): Promise<Skill | null> {
  const result = await db.execute({ sql: `SELECT * FROM skills WHERE id = ?`, args: [id] })
  return (result.rows[0] as unknown as Skill) ?? null
}

export async function createSkill(data: { category: string; name: string; sort_order: number }): Promise<{ id: number }> {
  const result = await db.execute({
    sql: `INSERT INTO skills (category, name, sort_order) VALUES (?,?,?)`,
    args: [data.category, data.name, data.sort_order],
  })
  return { id: Number(result.lastInsertRowid) }
}

export async function updateSkill(id: number, data: { category: string; name: string; sort_order: number }): Promise<void> {
  await db.execute({
    sql: `UPDATE skills SET category=?, name=?, sort_order=? WHERE id=?`,
    args: [data.category, data.name, data.sort_order, id],
  })
}

export async function deleteSkill(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM skills WHERE id=?`, args: [id] })
}
