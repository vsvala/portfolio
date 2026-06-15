import { test, expect } from '@playwright/test'

test('hero shows name and title', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Virva Svala/i })).toBeVisible()
  await expect(page.getByRole('heading', { name: /Ohjelmistosuunnittelija|Software Developer/i }).first()).toBeVisible()
})

test('CV download buttons present', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText(/Lataa CV|Download CV/i).first()).toBeVisible()
})

test('anchor sidebar visible on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await expect(page.getByText(/Sisältö|Contents/i).first()).toBeVisible()
})

test('work section present on homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#tyokokemus')).toBeAttached()
})

test('education section present on homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#koulutus')).toBeAttached()
})

test('hackathon section present on homepage', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#hackathon')).toBeAttached()
})

test('work cards link to detail pages', async ({ page }) => {
  await page.goto('/')
  // Use href selector to find actual work detail links (not "Näytä kaikki")
  const firstWorkCard = page.locator('#tyokokemus a[href^="/work/"]').first()
  await expect(firstWorkCard).toBeVisible()
  await firstWorkCard.click()
  await expect(page).toHaveURL(/\/work\/\d+/)
})
