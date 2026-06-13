// Run once: node scripts/migrate-recommendations.mjs
// Creates recommendations table and seeds the 4 LinkedIn recommendations.

import { createClient } from '@libsql/client'
import { readFileSync } from 'fs'
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

await db.execute(`
  CREATE TABLE IF NOT EXISTS recommendations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    relationship TEXT NOT NULL,
    rec_date TEXT NOT NULL,
    text TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`)
console.log('Table created (or already exists).')

const { rows } = await db.execute('SELECT COUNT(*) as n FROM recommendations')
if (Number(rows[0].n) > 0) {
  console.log('Recommendations already seeded — skipping.')
  process.exit(0)
}

const recommendations = [
  {
    name: 'Martin Kantor',
    role: 'Senior Creative Broadcast Engineer',
    company: 'MetService',
    relationship: 'Martin worked with Virva but they were at different companies',
    rec_date: '2026-05-27',
    text: `I had the pleasure of working with Virva for several years when her company became our strategic partner in Finland, and I would wholeheartedly recommend her as a team member. Virva worked across both graphic design and Weatherscape XT software - designing and operating weather shows, managing weather data assets, and delivering customer graphics to a best standards with care and reliability.

She is easy and enjoyable to work with, communicates clearly, adapts well, and brings a warmth to the team that makes a real difference. Colleagues like that are genuinely valued.

I hope she finds a great team that recognises everything she has to offer.`,
    sort_order: 1,
  },
  {
    name: 'Petri Marjava',
    role: 'Growth, data & digital, internationalization, HR and leadership',
    company: '',
    relationship: 'Petri was senior to Virva but didn\'t manage Virva directly',
    rec_date: '2026-05-26',
    text: `Virva is a versatile software developer who combines software engineering, media production, and graphic design among many other skills.

At Foreca, she worked on web platforms as well as various B2B and B2C customer and media products. Her expertise includes advanced map and weather data visualizations, print layouts, and broadcast video systems, including end-user training and support. Acting as a technical expert, she effortlessly connected developers, meteorologists, and clients.

Virva is a reliable team player with an enthusiastic and positive drive. She is a well-liked colleague whose uplifting presence brings a boost of energy to any team. I recommend her to any team seeking a solution-oriented software professional with visual design expertise.`,
    sort_order: 2,
  },
  {
    name: 'Markus Mäntykannas',
    role: 'Meteorologist',
    company: 'Foreca Oy',
    relationship: 'Markus worked with Virva but on different teams',
    rec_date: '2026-05-21',
    text: `I had the pleasure of working with Virva at Foreca. Virva was a reliable colleague who consistently delivered on her commitments. She worked on the technical side, but was also able to communicate technical matters clearly and understandably to other teams. Virva is a great team player.`,
    sort_order: 3,
  },
  {
    name: 'Kimmo Kärkkäinen',
    role: 'creating great services together',
    company: '',
    relationship: 'Kimmo managed Virva directly',
    rec_date: '2021-11-10',
    text: `Virva has got eye for beautiful design and user interface development. She is excellent team player with good social skills. Virva can also take projects forward independently. It was nice to work with her at Foreca.`,
    sort_order: 4,
  },
]

for (const r of recommendations) {
  await db.execute({
    sql: `INSERT INTO recommendations (name, role, company, relationship, rec_date, text, sort_order)
          VALUES (:name, :role, :company, :relationship, :rec_date, :text, :sort_order)`,
    args: r,
  })
  console.log(`Inserted: ${r.name}`)
}

console.log('Done.')
