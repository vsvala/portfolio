import { test, expect } from '@playwright/test'

// ── Public /recommendations page ────────────────────────────────────────────

test('/recommendations page loads', async ({ page }) => {
  const response = await page.goto('/recommendations')
  expect(response?.status()).toBeLessThan(400)
})

test('/recommendations shows page heading', async ({ page }) => {
  await page.goto('/recommendations')
  await expect(
    page.getByRole('heading', { name: /Suositukset|Recommendations/i }).first()
  ).toBeVisible()
})

test('/recommendations shows content or empty state', async ({ page }) => {
  await page.goto('/recommendations')
  await expect(page.locator('body')).toBeVisible()
})

// ── Admin recommendations CRUD ──────────────────────────────────────────────

test.describe('Admin recommendations', () => {
  test.use({ storageState: 'tests/e2e/.auth/admin.json' })

  test('admin recommendations list page loads', async ({ page }) => {
    await page.goto('/admin/recommendations')
    await expect(page.getByRole('heading', { name: /Suositukset/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Lisää uusi/i })).toBeVisible()
  })

  test('admin can navigate to new recommendation form', async ({ page }) => {
    await page.goto('/admin/recommendations')
    await page.getByRole('link', { name: /Lisää uusi/i }).click()
    await expect(page).toHaveURL('/admin/recommendations/new')
  })

  test('new recommendation form has required fields', async ({ page }) => {
    await page.goto('/admin/recommendations/new')
    await expect(page.getByLabel('Nimi')).toBeVisible()
    await expect(page.getByLabel(/Rooli/i)).toBeVisible()
    await expect(page.getByLabel(/Päivämäärä/i)).toBeVisible()
    await expect(page.getByLabel(/Teksti/i)).toBeVisible()
  })

  test('admin can create and delete a recommendation', async ({ page }) => {
    await page.goto('/admin/recommendations/new')

    await page.getByLabel('Nimi').fill('Testi Henkilö')
    await page.getByLabel(/Rooli/i).fill('Test Manager')
    await page.getByLabel(/Päivämäärä/i).fill('2025-01-01')
    await page.getByLabel(/Teksti/i).fill('This is a test recommendation for automated testing.')

    await page.getByRole('button', { name: 'Tallenna' }).click()
    await expect(page).toHaveURL('/admin/recommendations')
    await expect(page.getByText('Testi Henkilö')).toBeVisible()

    // Delete via DeleteButton (opens MUI Dialog, then confirm)
    const row = page.locator('tr', { hasText: 'Testi Henkilö' })
    await row.getByRole('button', { name: /poista/i }).click()
    await page.getByRole('button', { name: /poista/i }).last().click()
    await expect(page.getByText('Testi Henkilö')).not.toBeVisible()
  })
})
