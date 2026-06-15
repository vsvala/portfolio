export function toArgs(
  data: Record<string, unknown>,
  id?: number
): Record<string, string | number | null> {
  const obj = id !== undefined ? { ...data, id } : data
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v])
  ) as Record<string, string | number | null>
}

/**
 * Casts libsql Row results to a typed entity array.
 * The cast is intentional: libsql's Row type carries no column type information,
 * but we own the schema and the SQL selects the exact columns defined in T.
 */
export function mapRows<T>(rows: unknown[]): T[] {
  return rows as T[]
}

export function mapRow<T>(row: unknown): T {
  return row as T
}
