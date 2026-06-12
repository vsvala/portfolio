import Database from 'better-sqlite3'
import 'server-only'
import path from 'path'
import fs from 'fs'

const dbPath = path.join(process.cwd(), 'portfolio.db')
const schemaPath = path.join(process.cwd(), 'lib/db/schema.sql')

const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

const schema = fs.readFileSync(schemaPath, 'utf8')
db.exec(schema)

export default db
