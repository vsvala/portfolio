import { test, expect } from "@playwright/test";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "vaihda_tama_salasana";

test("/admin redirects to /admin/login when not logged in", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL("/admin/login");
});

test("login page has password field and submit button", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.locator('input[type="password"]')).toBeVisible();
  // Use exact name to avoid matching "Kirjaudu ulos" logout button
  await expect(page.getByRole("button", { name: "Kirjaudu sisään" })).toBeVisible();
});

test("wrong password shows error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator('input[type="password"]').fill("wrong-password-xyz");
  await page.getByRole("button", { name: "Kirjaudu sisään" }).click();
  await expect(page.getByText(/virheellinen|invalid|incorrect|väärä/i)).toBeVisible();
});

test("correct password logs in and redirects to dashboard", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Kirjaudu sisään" }).click();
  await expect(page).toHaveURL("/admin");
  await expect(page.getByText(/dashboard|hallinta|sisältö|työkokemus/i).first()).toBeVisible();
});

test("admin dashboard shows content counts after login", async ({ page }) => {
  await page.goto("/admin/login");
  await page.locator('input[type="password"]').fill(ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Kirjaudu sisään" }).click();
  await expect(page).toHaveURL("/admin");
  await expect(page.getByText(/Työkokemus|Koulutus|Projektit/i).first()).toBeVisible();
});
