# Agent A — Data-kerros

**Tila**: VALMIS ✅

## Vastuu
Tietokantakyselyjen kerros SQLite:lle (better-sqlite3).

## Luodut tiedostot
- `work.ts` — getAllWork, getWorkById, createWork, updateWork, deleteWork
- `projects.ts` — getAllProjects, getProjectById, createProject, updateProject, deleteProject
- `education.ts` — getAllEducation, getEducationById, createEducation, updateEducation, deleteEducation
- `documents.ts` — getAllDocuments, getDocumentById, createDocument, deleteDocument

## Käytännöt
- Jokainen tiedosto: `import 'server-only'` alussa
- DB-singleton: `import db from '@/lib/db'`
- Synkroninen API: `.all()`, `.get()`, `.run()`
- `technologies` palautetaan JSON-merkkijonona — parse komponenteissa
- `updated_at` päivittyy automaattisesti `datetime('now')` UPDATE:ssa
- `getAllWork` järjestää `ORDER BY sort_order ASC, created_at DESC`