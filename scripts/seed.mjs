// Run once: node scripts/seed.mjs
// Inserts Virva Svala's CV data into the SQLite database.
// Safe to run multiple times — skips insertion if data already exists.

import Database from "better-sqlite3";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = resolve(__dirname, "..", "portfolio.db");

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ── Work experience ──────────────────────────────────────────────────────────

const workEntries = [
  {
    company_name_fi: "Foreca",
    company_name_en: "Foreca",
    role_fi: "Ohjelmistosuunnittelija",
    role_en: "Software Developer",
    description_fi:
      "Full Stack -kehitys ja ylläpito kuluttajapuolen sääpalveluille, B2B-kehittäjäportaalille sekä dynaamisille sääsovelluksille. Toimin myös teknisenä asiantuntijana palveluiden toteutuksessa sekä vaatimusten koordinoinnissa sisäisten tiimien ja asiakkaiden välillä.",
    description_en:
      "Full Stack development and maintenance of consumer weather services, B2B developer portal, and dynamic weather applications. Also served as a technical expert in service implementation and coordinating requirements between internal teams and customers.",
    start_date: "2020",
    end_date: "2026",
    technologies: JSON.stringify([
      "React",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Next.js",
      "SQL",
      "Leaflet",
      "MapLibre",
      "Git",
      "Kanban",
      "Scrum",
      "GitHub Copilot",
      "Claude Code",
    ]),
    certificate_document_id: null,
    sort_order: 1,
  },
  {
    company_name_fi: "Tietojenkäsittelytieteen osasto, Helsingin yliopisto",
    company_name_en: "Department of Computer Science, University of Helsinki",
    role_fi: "Kurssiassistentti",
    role_en: "Course Assistant",
    description_fi:
      "Kurssiassistentti tietojenkäsittelytieteen osastolla kesällä 2019 ja syksyllä 2019.",
    description_en:
      "Course assistant at the Department of Computer Science in summer 2019 and autumn 2019.",
    start_date: "2019",
    end_date: "2019",
    technologies: JSON.stringify([]),
    certificate_document_id: null,
    sort_order: 2,
  },
  {
    company_name_fi: "Munkkiniemen yhteiskoulu",
    company_name_en: "Munkkiniemi School",
    role_fi: "Kuvataiteen opettaja",
    role_en: "Art Teacher",
    description_fi: "Kuvataiteen opettaja peruskoulussa ja lukiossa.",
    description_en: "Art teacher in primary and upper secondary school.",
    start_date: "2011",
    end_date: "2017",
    technologies: JSON.stringify([]),
    certificate_document_id: null,
    sort_order: 3,
  },
  {
    company_name_fi: "Eri oppilaitokset",
    company_name_en: "Various schools",
    role_fi: "Opetus- ja ohjaustehtävät",
    role_en: "Teaching and Instructional Roles",
    description_fi:
      "Monipuolisissa opetustehtävissä kuvataiteen- ja liikunnan tuntiopettajana sekä luokanopettajana eri luokka-asteilla peruskoulussa, lukiossa ja ammattikoulussa. Myös kesäleirien rehtorina ja ohjaajana.",
    description_en:
      "Worked in diverse teaching roles as an art and physical education subject teacher and class teacher at various grade levels in primary school, upper secondary school, high school, and vocational school. Also as headmaster and instructor at summer camps.",
    start_date: "2003",
    end_date: "2017",
    technologies: JSON.stringify([]),
    certificate_document_id: null,
    sort_order: 4,
  },
];

// ── Education ────────────────────────────────────────────────────────────────

const educationEntries = [
  {
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    degree_fi: "FM, Tietojenkäsittelytiede",
    degree_en: "M.Sc., Computer Science",
    description_fi:
      "Maisteriopinnot suoritettu kokopäiväisen työn ohessa. Kandidaatintutkinto (kandidaatti) suoritettuna aiemmin samassa tiedekunnassa.",
    description_en:
      "Master's studies completed alongside full-time work. Bachelor's degree completed earlier at the same faculty.",
    start_date: "2016",
    end_date: "2025",
    document_id: null,
    sort_order: 1,
  },
  {
    institution_fi: "Otavan opisto",
    institution_en: "Otava Institute",
    degree_fi: "Verkkotuotanto, AV-viestintä",
    degree_en: "Web Production, AV Communication",
    description_fi: "Opinnot verkkotuotannossa ja AV-viestinnässä.",
    description_en: "Studies in web production and AV communication.",
    start_date: "2011",
    end_date: "2012",
    document_id: null,
    sort_order: 2,
  },
  {
    institution_fi: "TaiK, Taidekasvatuksen osasto",
    institution_en: "TaiK, Department of Art Education",
    degree_fi: "TaM, Taidekasvatus",
    degree_en: "MA, Art Education",
    description_fi:
      "Taidekasvatuksen maisterin tutkinto Taideteollisessa korkeakoulussa. Vaihto-opiskelu: Kyproksen Suomi-koulu syksy 2001, Malmön yliopisto (kasvatustiede) kevät 2000, Haagse Hogeschool, Haag (Hollanti) syksy 1999.",
    description_en:
      "Master of Arts in Art Education at the University of Art and Design Helsinki. Exchange studies: Cyprus Finnish School, autumn 2001; Malmö University (pedagogy), spring 2000; Haagse Hogeschool, The Hague (Netherlands), autumn 1999.",
    start_date: "1998",
    end_date: "2009",
    document_id: null,
    sort_order: 3,
  },
  {
    institution_fi: "Oulun yliopisto, Opettajankoulutuslaitos",
    institution_en: "University of Oulu, Teacher Education",
    degree_fi: "KM, Opettajankoulutus",
    degree_en: "MEd, Teacher Education",
    description_fi: "Kasvatustieteiden maisteri, luokanopettajan koulutus.",
    description_en: "Master of Education, class teacher training programme.",
    start_date: "1997",
    end_date: "2003",
    document_id: null,
    sort_order: 4,
  },
];

// ── Insert helpers ───────────────────────────────────────────────────────────

const insertWork = db.prepare(`
  INSERT INTO work_experience
    (company_name_fi, company_name_en, role_fi, role_en,
     description_fi, description_en, start_date, end_date,
     technologies, certificate_document_id, sort_order)
  VALUES
    (@company_name_fi, @company_name_en, @role_fi, @role_en,
     @description_fi, @description_en, @start_date, @end_date,
     @technologies, @certificate_document_id, @sort_order)
`);

const insertEducation = db.prepare(`
  INSERT INTO education
    (institution_fi, institution_en, degree_fi, degree_en,
     description_fi, description_en, start_date, end_date,
     document_id, sort_order)
  VALUES
    (@institution_fi, @institution_en, @degree_fi, @degree_en,
     @description_fi, @description_en, @start_date, @end_date,
     @document_id, @sort_order)
`);

const countWork = db.prepare("SELECT COUNT(*) AS n FROM work_experience").get();
const countEdu = db.prepare("SELECT COUNT(*) AS n FROM education").get();

if (countWork.n > 0 || countEdu.n > 0) {
  console.log(
    `Database already has ${countWork.n} work entries and ${countEdu.n} education entries.`
  );
  console.log(
    "Skipping seed to avoid duplicates. Delete existing rows first if you want to re-seed."
  );
  db.close();
  process.exit(0);
}

const seedAll = db.transaction(() => {
  for (const entry of workEntries) insertWork.run(entry);
  for (const entry of educationEntries) insertEducation.run(entry);
});

seedAll();
db.close();

console.log(
  `✓ Seeded ${workEntries.length} work entries and ${educationEntries.length} education entries.`
);
