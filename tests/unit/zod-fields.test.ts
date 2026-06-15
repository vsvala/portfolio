import { describe, it, expect } from 'vitest'
import { z } from 'zod'
import { technologiesField } from '@/lib/zod-fields'

const Schema = z.object({ technologies: technologiesField })

describe('technologiesField', () => {
  it('converts CSV to JSON array', () => {
    const result = Schema.parse({ technologies: 'React, TypeScript, Node.js' })
    expect(result.technologies).toBe('["React","TypeScript","Node.js"]')
  })

  it('trims whitespace from CSV values', () => {
    const result = Schema.parse({ technologies: '  React ,  TypeScript  ' })
    expect(result.technologies).toBe('["React","TypeScript"]')
  })

  it('filters empty values from CSV', () => {
    const result = Schema.parse({ technologies: 'React,,TypeScript,' })
    expect(result.technologies).toBe('["React","TypeScript"]')
  })

  it('returns "[]" for empty string', () => {
    const result = Schema.parse({ technologies: '' })
    expect(result.technologies).toBe('[]')
  })

  it('returns "[]" for whitespace-only string', () => {
    const result = Schema.parse({ technologies: '   ' })
    expect(result.technologies).toBe('[]')
  })

  it('passes through an existing JSON array unchanged', () => {
    const json = '["React","TypeScript"]'
    const result = Schema.parse({ technologies: json })
    expect(result.technologies).toBe(json)
  })

  it('defaults to "[]" when field is absent', () => {
    const result = Schema.parse({})
    expect(result.technologies).toBe('[]')
  })
})
