import { createClient } from "@libsql/client";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "test.db");

const SCHEMA = `
CREATE TABLE IF NOT EXISTS pdf_documents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  filename TEXT NOT NULL UNIQUE,
  label_fi TEXT NOT NULL,
  label_en TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('cv','work_certificate','study_certificate','other')),
  file_size INTEGER NOT NULL,
  is_protected INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS work_experience (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name_fi TEXT NOT NULL,
  company_name_en TEXT NOT NULL,
  role_fi TEXT NOT NULL,
  role_en TEXT NOT NULL,
  description_fi TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT,
  technologies TEXT NOT NULL DEFAULT '[]',
  certificate_document_id INTEGER REFERENCES pdf_documents(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS education (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  institution_fi TEXT NOT NULL,
  institution_en TEXT NOT NULL,
  degree_fi TEXT NOT NULL,
  degree_en TEXT NOT NULL,
  thesis_url TEXT,
  description_fi TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT,
  document_id INTEGER REFERENCES pdf_documents(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title_fi TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_fi TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  long_description_fi TEXT NOT NULL DEFAULT '',
  long_description_en TEXT NOT NULL DEFAULT '',
  technologies TEXT NOT NULL DEFAULT '[]',
  url TEXT,
  repo_url TEXT,
  category TEXT NOT NULL DEFAULT 'hackathon',
  status TEXT,
  document_id INTEGER REFERENCES pdf_documents(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  target_type TEXT NOT NULL CHECK (target_type IN ('work', 'project', 'education')),
  target_id INTEGER NOT NULL,
  target_title TEXT NOT NULL,
  message TEXT NOT NULL,
  sender_name TEXT,
  sender_email TEXT,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_fi TEXT NOT NULL,
  name_en TEXT NOT NULL,
  institution_fi TEXT NOT NULL,
  institution_en TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'other',
  credits INTEGER,
  year INTEGER,
  description_fi TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  url TEXT,
  grade TEXT,
  education_id INTEGER REFERENCES education(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

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
);

CREATE TABLE IF NOT EXISTS skills (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);
`;

export async function seedTestDb() {
  // Remove stale test DB files
  for (const suffix of ["", "-shm", "-wal"]) {
    try {
      fs.unlinkSync(DB_PATH + suffix);
    } catch {
      /* already gone */
    }
  }

  const db = createClient({ url: `file:${DB_PATH}` });

  for (const stmt of SCHEMA.split(";")
    .map((s) => s.trim())
    .filter(Boolean)) {
    await db.execute(stmt);
  }

  // work_experience — id=1 (homepage card), id=2 (detail + feedback tests)
  await db.execute({
    sql: `INSERT INTO work_experience (id, company_name_fi, company_name_en, role_fi, role_en, start_date, end_date, sort_order)
          VALUES (1, 'Testiyritys', 'Test Company', 'Ohjelmistokehittäjä', 'Software Developer', '2022-01', NULL, 1)`,
    args: [],
  });
  await db.execute({
    sql: `INSERT INTO work_experience (id, company_name_fi, company_name_en, role_fi, role_en, start_date, end_date, sort_order)
          VALUES (2, 'Toinen Yritys', 'Second Company', 'Senior Developer', 'Senior Developer', '2020-01', '2021-12', 2)`,
    args: [],
  });

  // education — id=1 (detail + feedback + education page + smoke tests)
  await db.execute({
    sql: `INSERT INTO education (id, institution_fi, institution_en, degree_fi, degree_en, start_date, sort_order)
          VALUES (1, 'Helsingin yliopisto', 'University of Helsinki', 'FM, Tietojenkäsittelytiede', 'MSc, Computer Science', '2017', 1)`,
    args: [],
  });

  // projects — id=1 (detail + feedback + smoke tests)
  await db.execute({
    sql: `INSERT INTO projects (id, title_fi, title_en, category, sort_order)
          VALUES (1, 'Testiprojekti', 'Test Project', 'personal', 1)`,
    args: [],
  });

  db.close();
}
