import { test, expect } from '@playwright/test'

const publicRoutes = ['/', '/work', '/education', '/projects', '/contact', '/recommendations']

for (const route of publicRoutes) {
  test(`${route} loads without error`, async ({ page }) => {
    const response = await page.goto(route)
    expect(response?.status()).toBeLessThan(400)
    await expect(page.locator('body')).toBeVisible()
  })
}

test('/work/2 detail page loads', async ({ page }) => {
  const response = await page.goto('/work/2')
  expect(response?.status()).toBeLessThan(400)
})

test('/education/1 detail page loads', async ({ page }) => {
  const response = await page.goto('/education/1')
  expect(response?.status()).toBeLessThan(400)
})

test('/projects/1 detail page loads', async ({ page }) => {
  const response = await page.goto('/projects/1')
  expect(response?.status()).toBeLessThan(400)
})

test('unknown route returns 404', async ({ page }) => {
  const response = await page.goto('/this-does-not-exist-xyz')
  expect(response?.status()).toBe(404)
})
