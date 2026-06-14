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

const stats = statSync(resolve(__dirname, '..', 'private-documents', 'av-viestinta-tutkintotodistus-virva-svala.jpg'))
console.log('File size:', stats.size)

// Insert protected document
const ins = await db.execute({
  sql: `INSERT INTO pdf_documents (filename, label_fi, label_en, document_type, file_size, is_protected)
        VALUES (?, ?, ?, ?, ?, 1)`,
  args: [
    'av-viestinta-tutkintotodistus-virva-svala.jpg',
    'Tutkintotodistus – AV-viestintä',
    'Diploma – AV Communication',
    'study_certificate',
    stats.size,
  ]
})
const docId = Number(ins.lastInsertRowid)
console.log('Inserted doc id:', docId)

// Update education id 2 with document_id and richer description
await db.execute({
  sql: `UPDATE education SET
    document_id = ?,
    description_fi = ?,
    description_en = ?
  WHERE id = 2`,
  args: [
    docId,
    `Audiovisuaalisen viestinnän ammattitutkinto, verkkoviestinnän osaamisala. Tutkinto suoritettiin Otavan Opistossa, joka on erikoistunut verkko-opetukseen ja monimuoto-opiskeluun.

Tutkinnon osat (kaikki arvioitu hyväksytysti):
• Verkkoviestinnän suunnittelu ja ilmaisu
• Verkkoviestinnän työmenetelmät ja -välineet
• Verkkoviestinnän tuotantoprosessit ja -ympäristö

Tutkinnon myönsi Audiovisuaalisen viestinnän tutkintotoimikunta (26.9.2012).`,
    `Professional Qualification in Audiovisual Communication, specialisation in Web Communication. Completed at Otavan Opisto, a Finnish institution specialising in online and distance learning.

Qualification modules (all graded Passed):
• Web communication planning and expression
• Web communication methods and tools
• Web communication production processes and environment

Certificate issued by the Committee for Audiovisual Communication Qualifications (26 September 2012).`,
  ]
})
console.log('Updated education 2 description and document_id =', docId)

await db.close()
