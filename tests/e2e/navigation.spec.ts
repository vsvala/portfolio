import { test, expect } from '@playwright/test'

test('top nav has all main links', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  // AppBar renders as <header>, not <nav>
  const header = page.locator('header').first()
  await expect(header.getByRole('link', { name: /Etusivu|Home/i })).toBeVisible()
  await expect(header.getByRole('link', { name: /Työkokemus|Experience/i })).toBeVisible()
  await expect(header.getByRole('link', { name: /Koulutus|Education/i })).toBeVisible()
  await expect(header.getByRole('link', { name: /Projektit|Projects/i })).toBeVisible()
  await expect(header.getByRole('link', { name: /Yhteystiedot|Contact/i })).toBeVisible()
})

test('GitHub icon link present in nav', async ({ page }) => {
  await page.goto('/')
  const githubLink = page.locator('a[href*="github.com"]').first()
  await expect(githubLink).toBeVisible()
})

test('language toggle FI/EN visible', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  // Scope to header to avoid matching page content
  const header = page.locator('header').first()
  await expect(header.getByRole('button', { name: 'FI', exact: true })).toBeVisible()
  await expect(header.getByRole('button', { name: 'EN', exact: true })).toBeVisible()
})

test('clicking EN switches to English', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  const header = page.locator('header').first()
  await header.getByRole('button', { name: 'EN', exact: true }).click()
  await page.waitForLoadState('networkidle')
  await expect(page.getByText(/Software Developer|Work experience|Experience/i).first()).toBeVisible()
})

test('logo Virva Svala visible in nav', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Virva Svala').first()).toBeVisible()
})

test('work page link navigates correctly', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await page.locator('header').first().getByRole('link', { name: /Työkokemus|Experience/i }).click()
  await expect(page).toHaveURL('/work')
})
