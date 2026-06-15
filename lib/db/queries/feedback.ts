import 'server-only'
import db from '@/lib/db'
import { mapRows, mapRow } from '@/lib/db/utils'
import type { Feedback } from '@/lib/types'

export async function createFeedback(data: Omit<Feedback, 'id' | 'created_at' | 'is_read'>): Promise<void> {
  await db.execute({
    sql: `INSERT INTO feedback (target_type, target_id, target_title, message, sender_name, sender_email)
          VALUES (:target_type, :target_id, :target_title, :message, :sender_name, :sender_email)`,
    args: data as Record<string, string | number | null>,
  })
}

export async function getAllFeedback(): Promise<Feedback[]> {
  const result = await db.execute(
    `SELECT * FROM feedback ORDER BY is_read ASC, created_at DESC`
  )
  return mapRows<Feedback>(result.rows)
}

export async function markFeedbackRead(id: number): Promise<void> {
  await db.execute({ sql: `UPDATE feedback SET is_read = 1 WHERE id = ?`, args: [id] })
}

export async function deleteFeedback(id: number): Promise<void> {
  await db.execute({ sql: `DELETE FROM feedback WHERE id = ?`, args: [id] })
}

export async function unreadFeedbackCount(): Promise<number> {
  const result = await db.execute(`SELECT COUNT(*) as n FROM feedback WHERE is_read = 0`)
  return Number(mapRow<{ n: number }>(result.rows[0]).n)
}
