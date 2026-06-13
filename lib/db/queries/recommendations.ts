import 'server-only'
import db from '@/lib/db'
import type { Recommendation } from '@/lib/types'

export async function getAllRecommendations(): Promise<Recommendation[]> {
  const result = await db.execute(
    `SELECT * FROM recommendations ORDER BY sort_order ASC, created_at DESC`
  )
  return result.rows as unknown as Recommendation[]
}
