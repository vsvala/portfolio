import { test, expect } from '@playwright/test'

// ── Public /education page ──────────────────────────────────────────────────

test('/education page loads', async ({ page }) => {
  const response = await page.goto('/education')
  expect(response?.status()).toBeLessThan(400)
})

test('/education shows page heading', async ({ page }) => {
  await page.goto('/education')
  await expect(page.getByRole('heading', { name: /Koulutus|Education/i }).first()).toBeVisible()
})

// ── Admin education CRUD ────────────────────────────────────────────────────

test.describe('Admin education', () => {
  test.use({ storageState: 'tests/e2e/.auth/admin.json' })

  test('admin education list page loads', async ({ page }) => {
    await page.goto('/admin/education')
    await expect(page.getByRole('heading', { name: /Koulutus/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Lisää uusi/i })).toBeVisible()
  })

  test('admin can navigate to new education form', async ({ page }) => {
    await page.goto('/admin/education')
    await page.getByRole('link', { name: /Lisää uusi/i }).click()
    await expect(page).toHaveURL('/admin/education/new')
    await expect(page.getByRole('heading', { name: /Lisää koulutus/i })).toBeVisible()
  })

  test('new education form has required fields', async ({ page }) => {
    await page.goto('/admin/education/new')
    await expect(page.getByLabel(/Oppilaitos \(FI\)/i)).toBeVisible()
    await expect(page.getByLabel(/Tutkinto \(FI\)/i)).toBeVisible()
    await expect(page.getByLabel(/Institution \(EN\)/i)).toBeVisible()
    await expect(page.getByLabel(/Degree \(EN\)/i)).toBeVisible()
    await expect(page.getByLabel(/Aloitusvuosi/i)).toBeVisible()
  })

  test('admin can create and delete an education entry', async ({ page }) => {
    await page.goto('/admin/education/new')

    await page.getByLabel(/Oppilaitos \(FI\)/i).fill('Testikoulu FI')
    await page.getByLabel(/Tutkinto \(FI\)/i).fill('Testitutkinto FI')
    await page.getByLabel(/Institution \(EN\)/i).fill('Test School EN')
    await page.getByLabel(/Degree \(EN\)/i).fill('Test Degree EN')
    await page.getByLabel(/Aloitusvuosi/i).fill('2020')
    await page.getByRole('button', { name: 'Tallenna' }).click()

    await expect(page).toHaveURL('/admin/education')
    const cells = page.getByRole('cell', { name: 'Testikoulu FI' })
    const countBefore = await cells.count()
    expect(countBefore).toBeGreaterThan(0)

    const row = page.locator('tr', { hasText: 'Testikoulu FI' }).first()
    await row.getByRole('button', { name: /poista/i }).click()
    await page.getByRole('button', { name: /poista/i }).last().click()
    await expect(page.getByRole('cell', { name: 'Testikoulu FI' })).toHaveCount(countBefore - 1)
  })
})
