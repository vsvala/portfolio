export function toArgs(
  data: Record<string, unknown>,
  id?: number
): Record<string, string | number | null> {
  const obj = id !== undefined ? { ...data, id } : data
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, v === undefined ? null : v])
  ) as Record<string, string | number | null>
}
