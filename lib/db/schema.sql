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
  education_id INTEGER REFERENCES education(id) ON DELETE SET NULL,
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
  description_fi TEXT NOT NULL DEFAULT '',
  description_en TEXT NOT NULL DEFAULT '',
  start_date TEXT NOT NULL,
  end_date TEXT,
  document_id INTEGER REFERENCES pdf_documents(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
