// Run once: node scripts/seed-turso.mjs
// Seeds all CV data into the Turso database.
// Reads TURSO_URL and TURSO_AUTH_TOKEN from .env.local

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

// ── Check if already seeded ───────────────────────────────────────────────────

const { rows } = await db.execute('SELECT COUNT(*) as n FROM work_experience')
if (Number(rows[0].n) > 0) {
  console.log('Database already has data — skipping seed.')
  process.exit(0)
}

// ── Work experience ──────────────────────────────────────────────────────────

const work = [
  {
    company_name_fi: 'Foreca', company_name_en: 'Foreca',
    role_fi: 'Ohjelmistosuunnittelija', role_en: 'Software Developer',
    description_fi: 'Ohjelmistokehitys ja käyttöliittymäsuunnittelu Forecan kuluttajaverkkosivustoille ja B2B-kehittäjäportaalille. Sääntuotantopalveluissa käytettävien ohjelmistojen ja järjestelmien suunnittelu, toteutus ja ylläpito. Grafiikan, käyttöliittymien ja sisällön suunnittelu. Datan visualisointi mukaan lukien videotuotanto ja karttatekno­logiat. Tuotantojärjestelmät sääpalveluille printtimediaan. Tekninen asiantuntija palveluiden toteutuksessa sekä vaatimusten koordinointi sisäisten tiimien ja asiakkaiden välillä. Tekoälytyökalujen hyödyntäminen tiedonhankinnassa ja kehitystyössä.',
    description_en: 'Software development and user interface design for Foreca\'s consumer websites and B2B developer portal. Design, implementation, and maintenance of software and systems used in weather service production. Designing graphics, user interfaces and content. Data visualization including video production and map technologies. Production systems for weather in print media. Served as a technical expert for service implementation and coordinating requirements between internal teams and customers. Use of AI tools to support information gathering and development.',
    start_date: '2020', end_date: '2026',
    technologies: JSON.stringify(['React','TypeScript','JavaScript','Node.js','Next.js','SQL','Leaflet','MapLibre','Git','Kanban','Scrum','GitHub Copilot','Claude Code']),
    certificate_document_id: null, sort_order: 1,
  },
  {
    company_name_fi: 'Tietojenkäsittelytieteen osasto, Helsingin yliopisto',
    company_name_en: 'Department of Computer Science, University of Helsinki',
    role_fi: 'Kurssiassistentti', role_en: 'Course Assistant',
    description_fi: 'Kurssiassistentti tietojenkäsittelytieteen osastolla kesällä 2019 ja syksyllä 2019.',
    description_en: 'Course assistant at the Department of Computer Science in summer 2019 and autumn 2019.',
    start_date: '2019', end_date: '2019',
    technologies: '[]', certificate_document_id: null, sort_order: 2,
  },
  {
    company_name_fi: 'Munkkiniemen yhteiskoulu', company_name_en: 'Munkkiniemi School',
    role_fi: 'Kuvataiteen opettaja', role_en: 'Art Teacher',
    description_fi: 'Peruskoulun ja lukion kuvataiteen päätoiminen tuntiopettaja. Erityistehtävinä: kuvataiteen lukiodiplomikurssien pitäminen ja niihin liittyvien näyttelyjen järjestäminen oppilaille ja vanhemmille, kansainvälisen yhteistyön kehittäminen (yhteistyöprojekti Tallinnan ja Kööpenhaminan kuvisopettajien kanssa), Munkan 75-vuotisjuhlajulkaisun graafinen suunnittelu ja taitto (kutsut, kirjekuoret, postimerkki, juhlaohjel­ma ja julisteet), Next-Gate -messujen Munkan osaston visuaalinen suunnittelu sekä lukion ryhmänohjaajana toimiminen.',
    description_en: 'Main-post art teacher in primary and upper secondary school. Special duties included: teaching art matriculation examination courses and organising related exhibitions for students and parents, developing international cooperation (joint project with art teachers in Tallinn and Copenhagen), graphic design and layout for the school\'s 75th anniversary publication (invitations, envelopes, commemorative stamp, programme and posters), visual design of the school\'s stand at the Next-Gate fair, and acting as a tutor teacher for upper secondary students.',
    start_date: '2011', end_date: '2018',
    technologies: '[]', certificate_document_id: null, sort_order: 3,
  },
  {
    company_name_fi: 'Eri oppilaitokset', company_name_en: 'Various schools',
    role_fi: 'Opetus- ja ohjaustehtävät', role_en: 'Teaching and Instructional Roles',
    description_fi: 'Monipuolisissa opetustehtävissä kuvataiteen- ja liikunnan tuntiopettajana sekä luokanopettajana eri luokka-asteilla peruskoulussa, lukiossa ja ammattikoulussa. Myös kesäleirien rehtorina ja ohjaajana.',
    description_en: 'Worked in diverse teaching roles as an art and physical education subject teacher and class teacher at various grade levels in primary school, upper secondary school, high school, and vocational school. Also as headmaster and instructor at summer camps.',
    start_date: '2003', end_date: '2017',
    technologies: '[]', certificate_document_id: null, sort_order: 4,
  },
]

// ── Education ────────────────────────────────────────────────────────────────

const education = [
  {
    institution_fi: 'Helsingin yliopisto', institution_en: 'University of Helsinki',
    degree_fi: 'FM, Tietojenkäsittelytiede', degree_en: 'M.Sc., Computer Science',
    description_fi: 'Maisteriopinnot suoritettu kokopäiväisen työn ohessa. Kandidaatintutkinto (kandidaatti) suoritettuna aiemmin samassa tiedekunnassa.',
    description_en: "Master's studies completed alongside full-time work. Bachelor's degree completed earlier at the same faculty.",
    start_date: '2016', end_date: '2025', document_id: null, sort_order: 1,
  },
  {
    institution_fi: 'Otavan opisto', institution_en: 'Otava Institute',
    degree_fi: 'Verkkotuotanto, AV-viestintä', degree_en: 'Web Production, AV Communication',
    description_fi: 'Opinnot verkkotuotannossa ja AV-viestinnässä.',
    description_en: 'Studies in web production and AV communication.',
    start_date: '2011', end_date: '2012', document_id: null, sort_order: 2,
  },
  {
    institution_fi: 'TaiK, Taidekasvatuksen osasto', institution_en: 'TaiK, Department of Art Education',
    degree_fi: 'TaM, Taidekasvatus', degree_en: 'MA, Art Education',
    description_fi: 'Taidekasvatuksen maisterin tutkinto Taideteollisessa korkeakoulussa. Vaihto-opiskelu: Kyproksen Suomi-koulu syksy 2001, Malmön yliopisto (kasvatustiede) kevät 2000, Haagse Hogeschool, Haag (Hollanti) syksy 1999.',
    description_en: 'Master of Arts in Art Education at the University of Art and Design Helsinki. Exchange studies: Cyprus Finnish School, autumn 2001; Malmö University (pedagogy), spring 2000; Haagse Hogeschool, The Hague (Netherlands), autumn 1999.',
    start_date: '1998', end_date: '2009', document_id: null, sort_order: 3,
  },
  {
    institution_fi: 'Oulun yliopisto, Opettajankoulutuslaitos', institution_en: 'University of Oulu, Teacher Education',
    degree_fi: 'KM, Opettajankoulutus', degree_en: 'MEd, Teacher Education',
    description_fi: 'Kasvatustieteiden maisteri, luokanopettajan koulutus.',
    description_en: 'Master of Education, class teacher training programme.',
    start_date: '1997', end_date: '2003', document_id: null, sort_order: 4,
  },
]

// ── Projects ─────────────────────────────────────────────────────────────────

const projects = [
  {
    title_fi: 'vaDOD — Graffathon 2024', title_en: 'vaDOD — Graffathon 2024',
    description_fi: 'Ryhmätyöpajademo Graffathon 2024 -tapahtumassa.',
    description_en: 'Group workshop demo at Graffathon 2024.',
    long_description_fi: 'Graffathon 2024 -työpajaprojekti, jossa yhdistettiin vektoripohjainen graafinen suunnittelu ja koodattu visuaalisuus p5.js:llä. Työ osoittaa kyvyn yhdistää luova visuaalinen suunnittelu suoraan koodiin perustuvaan toteutukseen.',
    long_description_en: 'A Graffathon 2024 workshop project combining vector-based graphic design with coded visuals using p5.js. Demonstrates the ability to integrate creative visual design with code-based implementation.',
    technologies: JSON.stringify(['p5.js','JavaScript','Adobe Illustrator']),
    url: 'https://www.demoparty.net/graffathon/graffathon-2024',
    repo_url: 'https://github.com/vsvala/vaDOD-Graffathon-24',
    document_id: null, sort_order: 1,
  },
  {
    title_fi: 'Murrr — Assembly 2019 One Scene', title_en: 'Murrr — Assembly 2019 One Scene',
    description_fi: 'vaDOD-ryhmän audiovisuaalinen demo Assembly 2019 -tapahtuman One Scene -kilpailuun.',
    description_en: 'vaDOD group audiovisual demo for the Assembly 2019 One Scene competition.',
    long_description_fi: 'Assembly 2019 -tapahtuman One Scene -kilpailuun valmistettu tiiviin aikarajoitteen audiovisuaalinen demotuotos vaDOD-ryhmässä. Projekti vaati tehokasta koodin optimointia ja tiimityötä visuaalisen ilmeen ja teknisen suorituskyvyn tasapainottamiseksi.',
    long_description_en: 'An audiovisual demo produced under tight time constraints for the Assembly 2019 One Scene competition as part of the vaDOD group. The project required efficient code optimisation and close teamwork to balance visual expression with technical performance.',
    technologies: JSON.stringify(['JavaScript','WebGL','Canvas']),
    url: null, repo_url: 'https://github.com/vsvala/murrr',
    document_id: null, sort_order: 2,
  },
  {
    title_fi: 'Mandaloid — Graffathon 2018', title_en: 'Mandaloid — Graffathon 2018',
    description_fi: 'Proseduraalinen mandala-generaattori. 2. sija Newcomer-sarjassa Graffathon-demopartyssa.',
    description_en: 'Procedural mandala generator. 2nd place in the Newcomer category at Graffathon demoparty.',
    long_description_fi: 'Graffathon-työpajaprojekti, joka keskittyi prosessuaaliseen grafiikkaan ja algoritmien visualisointiin. Projektissa generoidaan mandaloja dynaamisesti koodin avulla, mikä havainnollistaa geometristen algoritmien ja niiden reaaliaikaisen visuaalisen esittämisen ymmärtämistä. Sijoittui toiseksi Newcomer/Beginner-kategoriassa.',
    long_description_en: 'A Graffathon workshop project focused on procedural graphics and algorithm visualisation. The project generates mandalas dynamically through code, demonstrating understanding of geometric algorithms and their real-time visual representation. Placed 2nd in the Newcomer/Beginner category.',
    technologies: JSON.stringify(['Processing','Java']),
    url: 'https://www.aalto.fi/en/events/graffathon',
    repo_url: 'https://github.com/vsvala/graffathon19',
    document_id: null, sort_order: 3,
  },
  {
    title_fi: 'Graffathon 2017 — Itsenäinen osallistuminen', title_en: 'Graffathon 2017 — Solo Entry',
    description_fi: 'Itsenäinen osallistuminen Graffathon-demopartyyn 2017.',
    description_en: 'Solo entry at Graffathon demoparty 2017.',
    long_description_fi: 'Itsenäinen osallistuminen Graffathon-demopartyyn vuonna 2017. Graffathon on Aalto-yliopiston järjestämä demoscene-tapahtuma, jossa ohjelmoijat, muusikot ja graafikot luovat reaaliaikaisia audiovisuaalisia teoksia kilpaillen eri kategorioissa.',
    long_description_en: 'Solo entry at the Graffathon demoparty in 2017. Graffathon is a demoscene event organised by Aalto University where programmers, musicians and graphic artists create real-time audiovisual works competing across different categories.',
    technologies: JSON.stringify(['Creative Coding','Demoscene']),
    url: 'https://www.aalto.fi/en/events/graffathon',
    repo_url: null, document_id: null, sort_order: 4,
  },
]

// ── Insert ────────────────────────────────────────────────────────────────────

for (const row of work) {
  await db.execute({
    sql: `INSERT INTO work_experience
           (company_name_fi, company_name_en, role_fi, role_en,
            description_fi, description_en, start_date, end_date,
            technologies, certificate_document_id, sort_order)
         VALUES
           (:company_name_fi, :company_name_en, :role_fi, :role_en,
            :description_fi, :description_en, :start_date, :end_date,
            :technologies, :certificate_document_id, :sort_order)`,
    args: row,
  })
}

for (const row of education) {
  await db.execute({
    sql: `INSERT INTO education
           (institution_fi, institution_en, degree_fi, degree_en,
            description_fi, description_en, start_date, end_date,
            document_id, sort_order)
         VALUES
           (:institution_fi, :institution_en, :degree_fi, :degree_en,
            :description_fi, :description_en, :start_date, :end_date,
            :document_id, :sort_order)`,
    args: row,
  })
}

for (const row of projects) {
  await db.execute({
    sql: `INSERT INTO projects
           (title_fi, title_en, description_fi, description_en,
            long_description_fi, long_description_en, technologies,
            url, repo_url, document_id, sort_order)
         VALUES
           (:title_fi, :title_en, :description_fi, :description_en,
            :long_description_fi, :long_description_en, :technologies,
            :url, :repo_url, :document_id, :sort_order)`,
    args: row,
  })
}

console.log(`✓ Seeded ${work.length} work, ${education.length} education, ${projects.length} project entries into Turso.`)
