import { test, expect } from '@playwright/test'

// ── Public /projects page ───────────────────────────────────────────────────

test('/projects page loads', async ({ page }) => {
  const response = await page.goto('/projects')
  expect(response?.status()).toBeLessThan(400)
})

test('/projects shows page heading', async ({ page }) => {
  await page.goto('/projects')
  await expect(page.getByRole('heading', { name: /Valitut projektit|Selected Projects/i })).toBeVisible()
})

// ── Admin projects CRUD ─────────────────────────────────────────────────────

test.describe('Admin projects', () => {
  test.use({ storageState: 'tests/e2e/.auth/admin.json' })

  test('admin projects list page loads', async ({ page }) => {
    await page.goto('/admin/projects')
    await expect(page.getByRole('heading', { name: /Projektit/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Lisää uusi/i })).toBeVisible()
  })

  test('admin can navigate to new project form', async ({ page }) => {
    await page.goto('/admin/projects')
    await page.getByRole('link', { name: /Lisää uusi/i }).click()
    await expect(page).toHaveURL('/admin/projects/new')
    await expect(page.getByRole('heading', { name: /Lisää projekti/i })).toBeVisible()
  })

  test('new project form has required fields and category options', async ({ page }) => {
    await page.goto('/admin/projects/new')
    await expect(page.getByLabel(/Otsikko \(FI\)/i)).toBeVisible()
    await expect(page.getByLabel(/Title \(EN\)/i)).toBeVisible()
    await expect(page.getByLabel(/Kategoria/i)).toBeVisible()
  })

  test('admin can create and delete a project', async ({ page }) => {
    await page.goto('/admin/projects/new')

    await page.getByLabel(/Otsikko \(FI\)/i).fill('Testiprojekti FI')
    await page.getByLabel(/Title \(EN\)/i).fill('Test Project EN')
    await page.getByRole('button', { name: 'Tallenna' }).click()

    await expect(page).toHaveURL('/admin/projects')
    const cells = page.getByRole('cell', { name: 'Testiprojekti FI' })
    const countBefore = await cells.count()
    expect(countBefore).toBeGreaterThan(0)

    const row = page.locator('tr', { hasText: 'Testiprojekti FI' }).first()
    await row.getByRole('button', { name: /poista/i }).click()
    await page.getByRole('button', { name: /poista/i }).last().click()
    await expect(page.getByRole('cell', { name: 'Testiprojekti FI' })).toHaveCount(countBefore - 1)
  })
})
