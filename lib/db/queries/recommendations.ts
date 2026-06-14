import 'server-only'
import db from '@/lib/db'
import type { Recommendation } from '@/lib/types'

export async function getAllRecommendations(): Promise<Recommendation[]> {
  const result = await db.execute(
    `SELECT * FROM recommendations ORDER BY sort_order ASC, created_at DESC`
  )
  return result.rows as unknown as Recommendation[]
}

export async function getRecommendationById(id: number): Promise<Recommendation | null> {
  const result = await db.execute({ sql: `SELECT * FROM recommendations WHERE id = ?`, args: [id] })
  return (result.rows[0] as unknown as Recommendation) ?? null
}

export async function createRecommendation(data: {
  name: string; role: string; company: string; relationship: string
  rec_date: string; text: string; sort_order: number
}): Promise<{ id: number }> {
  const result = await db.execute({
    sql: `INSERT INTO recommendations (name, role, company, relationship, rec_date, text, sort_order) VALUES (?,?,?,?,?,?,?)`,
    args: [data.name, data.role, data.company, data.relationship, data.rec_date, data.text, data.sort_order],
  })
  return { id: Number(result.lastInsertRowid) }
}

export async function updateRecommendation(id: number, data: {
  name: string; role: string; company: string; relationship: string
  rec_date: string; text: string; sort_order: number
}): Promise<void> {
  await db.execute({
    sql: `UPDATE recommendations SET name=?,role=?,company=?,relationship=?,rec_date=?,text=?,sort_order=? WHERE id=?`,
    args: [data.name, data.role, data.company, data.relationship, data.rec_date, data.text, data.sort_order, id],
  })
}

export async function deleteRecommendation(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM recommendations WHERE id=?`, args: [id] })
}
