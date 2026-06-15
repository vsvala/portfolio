import { chromium } from '@playwright/test'
import path from 'path'
import fs from 'fs'

const AUTH_FILE = path.join(__dirname, '.auth', 'admin.json')
const ADMIN_PASSWORD = 'vaihda_tama_salasana'

export default async function globalSetup() {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true })

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('http://localhost:3000/admin/login')
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Kirjaudu sisään' }).click()
  await page.waitForURL('**/admin', { timeout: 15000 })

  await context.storageState({ path: AUTH_FILE })
  await browser.close()
}
