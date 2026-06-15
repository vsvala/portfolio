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
 * Converts libsql Row results to plain objects typed as T.
 * Object.assign strips libsql's non-plain Row wrapper so React 19's
 * server→client serialization doesn't emit "Only plain objects" errors.
 */
export function mapRows<T>(rows: unknown[]): T[] {
  return (rows as Record<string, unknown>[]).map((row) => Object.assign({}, row)) as T[]
}

export function mapRow<T>(row: unknown): T {
  return Object.assign({}, row as Record<string, unknown>) as T
}
