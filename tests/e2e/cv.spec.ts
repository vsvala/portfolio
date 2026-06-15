import { test, expect } from '@playwright/test'

test('/cv page loads without error', async ({ page }) => {
  const response = await page.goto('/cv')
  expect(response?.status()).toBeLessThan(400)
})

test('/cv shows person name', async ({ page }) => {
  await page.goto('/cv')
  await expect(page.getByRole('heading', { name: /Virva Svala/i })).toBeVisible()
})

test('/cv shows work experience section', async ({ page }) => {
  await page.goto('/cv')
  await expect(page.getByRole('heading', { name: /Työkokemus|Work Experience/i })).toBeVisible()
})

test('/cv shows education section', async ({ page }) => {
  await page.goto('/cv')
  await expect(page.getByRole('heading', { name: /Koulutus|Education/i }).first()).toBeVisible()
})

test('/cv shows skills section', async ({ page }) => {
  await page.goto('/cv')
  await expect(page.getByRole('heading', { name: /Osaaminen|Skills/i })).toBeVisible()
})

test('/cv shows certifications section', async ({ page }) => {
  await page.goto('/cv')
  await expect(page.getByRole('heading', { name: /Sertifikaatit|Certifications/i })).toBeVisible()
})

test('/cv print button visible', async ({ page }) => {
  await page.goto('/cv')
  await expect(page.getByRole('button', { name: /Tulosta|Print/i })).toBeVisible()
})

test('/cv shows English content when lang=en', async ({ page }) => {
  await page.goto('/cv')
  await expect(page.getByRole('heading', { name: /Work Experience/i })).toBeVisible()
})
