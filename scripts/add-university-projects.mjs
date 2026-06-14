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

// Move existing Runoarkisto to university_solo
await db.execute({ sql: `UPDATE projects SET category = 'university_solo', sort_order = 3 WHERE id = 6`, args: [] })
console.log('Moved Runoarkisto → university_solo')

const soloProjects = [
  {
    title_fi: 'Art Club — Full Stack -sovellus',
    title_en: 'Art Club — Full Stack App',
    description_fi: 'Full Stack -harjoitustyö: taidekerhon hallintasovellus. React-frontend ja Node.js/Express-backend erillisistä repoista.',
    description_en: 'Full Stack coursework project: an art club management application. React frontend and Node.js/Express backend in separate repos.',
    technologies: '["JavaScript","React","Node.js","Express","MongoDB"]',
    repo_url: 'https://github.com/vsvala/Art_Club',
    sort_order: 1,
    category: 'university_solo',
  },
  {
    title_fi: 'RateWine — Ruby on Rails',
    title_en: 'RateWine — Ruby on Rails',
    description_fi: 'Web-palvelinohjelmointi-kurssin harjoitustyö. Viinien arvostelusovellus Ruby on Rails -kehyksellä.',
    description_en: 'Web server programming coursework. A wine rating application built with Ruby on Rails.',
    technologies: '["Ruby","Ruby on Rails","PostgreSQL"]',
    repo_url: 'https://github.com/vsvala/ratewine',
    sort_order: 2,
    category: 'university_solo',
  },
  {
    title_fi: 'Fakebook — Java / Spring Boot',
    title_en: 'Fakebook — Java / Spring Boot',
    description_fi: 'Web-palvelinohjelmointi-kurssin harjoitustyö. Sosiaalisen median harjoitussovellus Javalla.',
    description_en: 'Web server programming coursework. A social media practice application built with Java.',
    technologies: '["Java","Spring Boot","Thymeleaf"]',
    repo_url: 'https://github.com/vsvala/Fakebook',
    sort_order: 4,
    category: 'university_solo',
  },
]

const groupProjects = [
  {
    title_fi: 'Lukuvinkkikirjasto — Ohjelmistotuotanto',
    title_en: 'Reading Tips Library — Software Engineering',
    description_fi: 'Ohjelmistotuotantokurssin ryhmäminiprojekti. Lukuvinkkikirjasto toteutettiin Scrum-menetelmällä Java-backendillä.',
    description_en: 'Software Engineering course group mini-project. A reading tips library built as a Scrum team using Java backend.',
    technologies: '["Java","Scrum","GitHub Actions","PostgreSQL"]',
    repo_url: 'https://github.com/vsvala/DefinitionOfDone-Lukuvinkkikirjasto',
    sort_order: 1,
    category: 'university_group',
  },
]

for (const p of [...soloProjects, ...groupProjects]) {
  await db.execute({
    sql: `INSERT INTO projects
      (title_fi, title_en, description_fi, description_en,
       long_description_fi, long_description_en, technologies,
       url, repo_url, category, document_id, sort_order)
      VALUES (?, ?, ?, ?, '', '', ?, NULL, ?, ?, NULL, ?)`,
    args: [
      p.title_fi, p.title_en, p.description_fi, p.description_en,
      p.technologies, p.repo_url, p.category, p.sort_order,
    ],
  })
  console.log('Inserted:', p.title_en, '→', p.category)
}

await db.close()
console.log('Done.')
