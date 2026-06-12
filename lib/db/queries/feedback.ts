import 'server-only'
import db from '@/lib/db'
import type { Feedback } from '@/lib/types'

export function createFeedback(data: Omit<Feedback, 'id' | 'created_at' | 'is_read'>): void {
  db.prepare(`
    INSERT INTO feedback (target_type, target_id, target_title, message, sender_name, sender_email)
    VALUES (@target_type, @target_id, @target_title, @message, @sender_name, @sender_email)
  `).run(data)
}

export function getAllFeedback(): Feedback[] {
  return db.prepare(`SELECT * FROM feedback ORDER BY is_read ASC, created_at DESC`).all() as Feedback[]
}

export function markFeedbackRead(id: number): void {
  db.prepare(`UPDATE feedback SET is_read = 1 WHERE id = ?`).run(id)
}

export function deleteFeedback(id: number): void {
  db.prepare(`DELETE FROM feedback WHERE id = ?`).run(id)
}

export function unreadFeedbackCount(): number {
  const row = db.prepare(`SELECT COUNT(*) as n FROM feedback WHERE is_read = 0`).get() as { n: number }
  return row.n
}
