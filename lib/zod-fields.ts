import { z } from 'zod'

export const technologiesField = z.string().default('').transform((s) => {
  s = s.trim()
  if (!s) return '[]'
  if (s.startsWith('[')) return s
  return JSON.stringify(s.split(',').map((t) => t.trim()).filter(Boolean))
})
