import { chromium } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import { seedTestDb } from './seed-test-db'

const AUTH_FILE = path.join(__dirname, '.auth', 'admin.json')
const ADMIN_PASSWORD = 'vaihda_tama_salasana'

export default async function globalSetup() {
  await seedTestDb()

  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('http://localhost:3001/admin/login')
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click()
  await page.waitForURL('**/admin', { timeout: 15000 })

  await context.storageState({ path: AUTH_FILE })

  // Warm up admin routes so Next.js compiles them before tests start.
  // Without this, the first test on each fresh-compiled route can timeout.
  const warmupRoutes = [
    '/admin/work',
    '/admin/projects',
    '/admin/education',
    '/admin/courses',
    '/admin/skills',
    '/admin/recommendations',
  ]
  for (const route of warmupRoutes) {
    await page.goto(`http://localhost:3001${route}`)
    await page.waitForLoadState('networkidle')
  }

  await browser.close()
}
