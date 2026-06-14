import { createClient } from '@libsql/client'
import { readFileSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envContent = readFileSync(resolve(__dirname, '..', '.env.local'), 'utf-8')
const env = {}
for (const line of envContent.split('\n')) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const eq = t.indexOf('=')
  if (eq === -1) continue
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim()
}

const db = createClient({ url: env.TURSO_URL, authToken: env.TURSO_AUTH_TOKEN })

const work_experience = await db.execute('SELECT id, role_fi, role_en, company_name_fi FROM work_experience WHERE id = 4')
console.log('Work 4:', work_experience.rows[0])

const stats = statSync(resolve(__dirname, '..', 'private-documents', 'tyotodistus-hy-cs-virva-svala.jpeg'))
console.log('File size:', stats.size)

const ins = await db.execute({
  sql: `INSERT INTO pdf_documents (filename, label_fi, label_en, document_type, file_size, is_protected)
        VALUES (?, ?, ?, ?, ?, 1)`,
  args: ['tyotodistus-hy-cs-virva-svala.jpeg', 'Työtodistus – Helsingin yliopisto', 'Employment Certificate – University of Helsinki', 'work_certificate', stats.size]
})
const docId = Number(ins.lastInsertRowid)
console.log('Inserted doc id:', docId)

await db.execute({ sql: 'UPDATE work_experience SET certificate_document_id = ? WHERE id = 4', args: [docId] })
console.log('Done: work_experience 4 certificate_document_id =', docId)

await db.close()
