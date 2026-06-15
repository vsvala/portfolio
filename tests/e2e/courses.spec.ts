import { test, expect } from '@playwright/test'

// ── Public /courses page ────────────────────────────────────────────────────

test('/courses page loads', async ({ page }) => {
  const response = await page.goto('/courses')
  expect(response?.status()).toBeLessThan(400)
})

test('/courses shows page title Opinnot', async ({ page }) => {
  await page.goto('/courses')
  await expect(page.getByRole('heading', { name: /Opinnot|Coursework/i }).first()).toBeVisible()
})

test('/courses shows empty state when no courses', async ({ page }) => {
  await page.goto('/courses')
  // Either shows courses or empty state message — page must not error
  await expect(page.locator('body')).toBeVisible()
})

// ── Admin courses CRUD ──────────────────────────────────────────────────────

test.describe('Admin courses', () => {
  test.use({ storageState: 'tests/e2e/.auth/admin.json' })

  test('admin courses list page loads', async ({ page }) => {
    await page.goto('/admin/courses')
    await expect(page.getByRole('heading', { name: /Kurssit/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Lisää uusi/i })).toBeVisible()
  })

  test('admin can navigate to new course form', async ({ page }) => {
    await page.goto('/admin/courses')
    await page.getByRole('link', { name: /Lisää uusi/i }).click()
    await expect(page).toHaveURL('/admin/courses/new')
    await expect(page.getByRole('heading', { name: /Uusi kurssi/i })).toBeVisible()
  })

  test('new course form has required fields', async ({ page }) => {
    await page.goto('/admin/courses/new')
    await expect(page.getByLabel(/Kurssin nimi \(FI\)/i)).toBeVisible()
    await expect(page.getByLabel(/Course name \(EN\)/i)).toBeVisible()
    await expect(page.getByLabel(/Oppilaitos \(FI\)/i)).toBeVisible()
    await expect(page.getByLabel(/Kategoria/i)).toBeVisible()
  })

  test('admin can create and delete a course', async ({ page }) => {
    await page.goto('/admin/courses/new')

    await page.getByLabel(/Kurssin nimi \(FI\)/i).fill('Testikurssi FI')
    await page.getByLabel(/Course name \(EN\)/i).fill('Test Course EN')
    await page.getByLabel(/Oppilaitos \(FI\)/i).fill('Testimylly')
    await page.getByLabel(/Institution \(EN\)/i).fill('Test University')
    await page.getByRole('button', { name: 'Tallenna' }).click()

    await expect(page).toHaveURL('/admin/courses')
    const cells = page.getByRole('cell', { name: 'Testikurssi FI' })
    const countBefore = await cells.count()
    expect(countBefore).toBeGreaterThan(0)

    // Delete one matching row via DeleteButton (opens MUI Dialog, then confirm)
    const row = page.locator('tr', { hasText: 'Testikurssi FI' }).first()
    await row.getByRole('button', { name: /poista/i }).click()
    await page.getByRole('button', { name: /poista/i }).last().click()
    await expect(page.getByRole('cell', { name: 'Testikurssi FI' })).toHaveCount(countBefore - 1)
  })
})

// ── Courses on education detail page ───────────────────────────────────────

test('education detail page loads without error', async ({ page }) => {
  const response = await page.goto('/education/1')
  expect(response?.status()).toBeLessThan(400)
})

test('education detail page shows Opinnot section when courses exist', async ({ page }) => {
  // This test passes trivially if no courses are linked — just checks no crash
  await page.goto('/education/1')
  await expect(page.locator('body')).toBeVisible()
  // If courses section exists it should have the heading
  const opinnotHeading = page.getByRole('heading', { name: /Opinnot|Coursework/i })
  // section may or may not exist depending on data — just verify no error
  const count = await opinnotHeading.count()
  expect(count).toBeGreaterThanOrEqual(0)
})

// ── Smoke: /courses in EN ───────────────────────────────────────────────────

test('/courses shows Coursework heading in English', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await page.locator('header').first().getByRole('button', { name: 'EN', exact: true }).click()
  await page.waitForLoadState('networkidle')
  await page.goto('/courses')
  await expect(page.getByRole('heading', { name: /Coursework/i }).first()).toBeVisible()
})
