// node scripts/seed-courses.mjs
// Seeds relevant CS courses from the HY transcript into Turso.

import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(resolve(__dirname, "..", ".env.local"), "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const eq = t.indexOf("=");
  if (eq === -1) continue;
  env[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
}

const db = createClient({ url: env.TURSO_URL, authToken: env.TURSO_AUTH_TOKEN });

const { rows } = await db.execute("SELECT COUNT(*) as n FROM courses");
if (Number(rows[0].n) > 0) {
  console.log("Courses already seeded — skipping.");
  process.exit(0);
}

const HY_ID = 1; // FM Tietojenkäsittelytiede, Helsingin yliopisto

const courses = [
  // ── Ohjelmointi ──────────────────────────────────────────────────────────
  {
    name_fi: "Full Stack -websovelluskehitys",
    name_en: "Full Stack Web Development",
    institution_fi: "Helsingin yliopisto (Avoin yo)",
    institution_en: "University of Helsinki (Open University)",
    category: "programming",
    credits: 18,
    year: 2019,
    description_fi:
      "Kattava Full Stack -kurssi: React, Node.js, Express, MongoDB, GraphQL, TypeScript, CI/CD. Sisälsi kurssin (8 op) ja harjoitustyön (10 op).",
    description_en:
      "Comprehensive Full Stack course: React, Node.js, Express, MongoDB, GraphQL, TypeScript, CI/CD. Included coursework (8 cr) and project (10 cr).",
    url: "https://fullstackopen.com",
    grade: "5 / Hyv.",
    sort_order: 1,
    education_id: HY_ID,
  },
  {
    name_fi: "Ohjelmointitekniikka (JavaScript)",
    name_en: "Programming Techniques (JavaScript)",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "programming",
    credits: 5,
    year: 2018,
    description_fi:
      "JavaScript-ohjelmoinnin tekniikat, funktionaalinen ohjelmointi ja modernit JS-käytännöt.",
    description_en:
      "JavaScript programming techniques, functional programming and modern JS practices.",
    url: null,
    grade: "5",
    sort_order: 2,
    education_id: HY_ID,
  },
  {
    name_fi: "Web-palvelinohjelmointi Ruby on Rails",
    name_en: "Web Server Programming Ruby on Rails",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "programming",
    credits: 5,
    year: 2018,
    description_fi:
      "Web-sovellusten rakentaminen Ruby on Rails -kehyksellä. MVC-arkkitehtuuri, tietokannat, autentikointi.",
    description_en:
      "Building web applications with Ruby on Rails. MVC architecture, databases, authentication.",
    url: null,
    grade: "5",
    sort_order: 3,
    education_id: HY_ID,
  },
  {
    name_fi: "Web-palvelinohjelmointi Java",
    name_en: "Web Server Programming Java",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "programming",
    credits: 5,
    year: 2019,
    description_fi: "Java-pohjainen web-palvelinohjelmointi, Spring Boot, REST-rajapinnat.",
    description_en: "Java-based web server programming, Spring Boot, REST APIs.",
    url: null,
    grade: "5",
    sort_order: 4,
    education_id: HY_ID,
  },
  {
    name_fi: "Ohjelmistotuotanto",
    name_en: "Software Engineering",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "programming",
    credits: 6,
    year: 2018,
    description_fi:
      "Ketterät menetelmät (Scrum, Kanban), testaus, CI/CD, versionhallinta tiimityössä.",
    description_en: "Agile methods (Scrum, Kanban), testing, CI/CD, version control in team work.",
    url: null,
    grade: "5",
    sort_order: 5,
    education_id: HY_ID,
  },
  {
    name_fi: "Ohjelmistotuotantoprojekti",
    name_en: "Software Engineering Project",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "programming",
    credits: 10,
    year: 2019,
    description_fi:
      "Ryhmäprojekti oikealle asiakkaalle ketterillä menetelmillä. Vaatimusmäärittely, suunnittelu, toteutus ja testaus.",
    description_en:
      "Group project for a real client using agile methods. Requirements, design, implementation and testing.",
    url: null,
    grade: "5",
    sort_order: 6,
    education_id: HY_ID,
  },
  {
    name_fi: "Ohjelmistotekniikka",
    name_en: "Software Techniques",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "programming",
    credits: 5,
    year: 2019,
    description_fi: "Ohjelmistosuunnittelun periaatteet, suunnittelumallit, UML, arkkitehtuurit.",
    description_en: "Software design principles, design patterns, UML, architectures.",
    url: null,
    grade: "5",
    sort_order: 7,
    education_id: HY_ID,
  },
  {
    name_fi: "Ohjelmoinnin perusteet",
    name_en: "Introduction to Programming",
    institution_fi: "Helsingin yliopisto (Avoin yo)",
    institution_en: "University of Helsinki (Open University)",
    category: "programming",
    credits: 5,
    year: 2016,
    description_fi: "Ohjelmoinnin peruskäsitteet Javalla.",
    description_en: "Programming fundamentals with Java.",
    url: null,
    grade: "4",
    sort_order: 8,
    education_id: HY_ID,
  },
  {
    name_fi: "Ohjelmoinnin jatkokurssi",
    name_en: "Advanced Programming",
    institution_fi: "Helsingin yliopisto (Avoin yo)",
    institution_en: "University of Helsinki (Open University)",
    category: "programming",
    credits: 5,
    year: 2016,
    description_fi: "Olio-ohjelmointi, tietorakenteet ja algoritmit Javalla.",
    description_en: "Object-oriented programming, data structures and algorithms with Java.",
    url: null,
    grade: "3",
    sort_order: 9,
    education_id: HY_ID,
  },
  {
    name_fi: "Versionhallinta",
    name_en: "Version Control",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "programming",
    credits: 1,
    year: 2018,
    description_fi: "Git ja versionhallinnan käytänteet.",
    description_en: "Git and version control practices.",
    url: null,
    grade: "Hyv.",
    sort_order: 10,
    education_id: HY_ID,
  },

  // ── Tietokannat ──────────────────────────────────────────────────────────
  {
    name_fi: "Tietokantojen perusteet",
    name_en: "Introduction to Databases",
    institution_fi: "Helsingin yliopisto (Avoin yo)",
    institution_en: "University of Helsinki (Open University)",
    category: "databases",
    credits: 5,
    year: 2016,
    description_fi: "Relaatiotietokannat, SQL, tietokannan suunnittelu.",
    description_en: "Relational databases, SQL, database design.",
    url: null,
    grade: "5",
    sort_order: 1,
    education_id: HY_ID,
  },
  {
    name_fi: "Aineopintojen harjoitustyö: Tietokantasovellus",
    name_en: "Intermediate Project: Database Application",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "databases",
    credits: 4,
    year: 2018,
    description_fi: "Tietokantapohjaisen web-sovelluksen harjoitustyö.",
    description_en: "Project work: building a database-driven web application.",
    url: null,
    grade: "5",
    sort_order: 2,
    education_id: HY_ID,
  },

  // ── Tekoäly & data ───────────────────────────────────────────────────────
  {
    name_fi: "Elements of AI: Tekoälyn perusteet",
    name_en: "Elements of AI",
    institution_fi: "Helsingin yliopisto (Avoin yo)",
    institution_en: "University of Helsinki (Open University)",
    category: "ai_data",
    credits: 2,
    year: 2019,
    description_fi: "Tekoälyn peruskäsitteet, koneoppiminen ja yhteiskunnalliset vaikutukset.",
    description_en: "AI fundamentals, machine learning basics and societal implications.",
    url: "https://www.elementsofai.com",
    grade: "Hyv.",
    sort_order: 1,
    education_id: HY_ID,
  },
  {
    name_fi: "Python-ohjelmointia aloittelijoille",
    name_en: "Python Programming for Beginners",
    institution_fi: "Helsingin yliopisto (Avoin yo)",
    institution_en: "University of Helsinki (Open University)",
    category: "ai_data",
    credits: 3,
    year: 2018,
    description_fi: "Python-ohjelmoinnin perusteet.",
    description_en: "Python programming fundamentals.",
    url: null,
    grade: "4",
    sort_order: 2,
    education_id: HY_ID,
  },

  // ── Järjestelmät & verkot ────────────────────────────────────────────────
  {
    name_fi: "Käyttöjärjestelmät",
    name_en: "Operating Systems",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "systems",
    credits: 5,
    year: 2019,
    description_fi:
      "Käyttöjärjestelmien rakenne, prosessit, muistinhallinta, tiedostojärjestelmät.",
    description_en: "OS architecture, processes, memory management, file systems.",
    url: null,
    grade: "5",
    sort_order: 1,
    education_id: HY_ID,
  },
  {
    name_fi: "Tietoliikenteen perusteet",
    name_en: "Introduction to Data Communications",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "systems",
    credits: 5,
    year: 2019,
    description_fi: "Verkkoprotokollat, TCP/IP, HTTP, tietoliikenteen arkkitehtuurit.",
    description_en: "Network protocols, TCP/IP, HTTP, data communications architectures.",
    url: null,
    grade: "5",
    sort_order: 2,
    education_id: HY_ID,
  },
  {
    name_fi: "Tietorakenteet ja algoritmit",
    name_en: "Data Structures and Algorithms",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "systems",
    credits: 10,
    year: 2018,
    description_fi: "Algoritmien suunnittelu ja analyysi, keskeisimmät tietorakenteet.",
    description_en: "Algorithm design and analysis, core data structures.",
    url: null,
    grade: "1",
    sort_order: 3,
    education_id: HY_ID,
  },

  // ── Matematiikka & tilastot ──────────────────────────────────────────────
  {
    name_fi: "Tilastotiede ja R tutuksi I & II",
    name_en: "Introduction to Statistics and R I & II",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "math",
    credits: 10,
    year: 2017,
    description_fi: "Tilastotieteen perusteet ja R-ohjelmointikielen käyttö data-analyysissa.",
    description_en: "Statistics fundamentals and R programming for data analysis.",
    url: null,
    grade: "5",
    sort_order: 1,
    education_id: HY_ID,
  },
  {
    name_fi: "Lineaarialgebra ja matriisilaskenta I",
    name_en: "Linear Algebra and Matrix Calculus I",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "math",
    credits: 5,
    year: 2017,
    description_fi: "Vektorit, matriisit, lineaariset yhtälöryhmät.",
    description_en: "Vectors, matrices, systems of linear equations.",
    url: null,
    sort_order: 2,
    education_id: HY_ID,
  },
  {
    name_fi: "Todennäköisyyslaskenta I",
    name_en: "Probability Theory I",
    institution_fi: "Helsingin yliopisto",
    institution_en: "University of Helsinki",
    category: "math",
    credits: 5,
    year: 2018,
    description_fi: "Todennäköisyysteorian perusteet, satunnaismuuttujat, jakaumat.",
    description_en: "Probability theory fundamentals, random variables, distributions.",
    url: null,
    sort_order: 3,
    education_id: HY_ID,
  },
];

for (const c of courses) {
  await db.execute({
    sql: `INSERT INTO courses (name_fi, name_en, institution_fi, institution_en, category, credits, year,
          description_fi, description_en, url, grade, sort_order, education_id)
          VALUES (:name_fi, :name_en, :institution_fi, :institution_en, :category, :credits, :year,
          :description_fi, :description_en, :url, :grade, :sort_order, :education_id)`,
    args: { ...c, url: c.url ?? null, grade: c.grade ?? null },
  });
}

console.log(`✓ Seeded ${courses.length} courses into Turso.`);
