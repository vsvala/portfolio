import { test, expect } from "@playwright/test";

test.use({ storageState: "tests/e2e/.auth/admin.json" });

// ── Admin skills CRUD ───────────────────────────────────────────────────────

test("admin skills list page loads", async ({ page }) => {
  await page.goto("/admin/skills");
  await expect(page.getByRole("heading", { name: /Taidot|Skills/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Lisää uusi/i })).toBeVisible();
});

test("admin can navigate to new skill form", async ({ page }) => {
  await page.goto("/admin/skills");
  await page.getByRole("link", { name: /Lisää uusi/i }).click();
  await expect(page).toHaveURL("/admin/skills/new");
});

test("new skill form has required fields", async ({ page }) => {
  await page.goto("/admin/skills/new");
  await expect(page.getByLabel(/Taito/i)).toBeVisible();
  await expect(page.getByLabel(/Kategoria/i)).toBeVisible();
  await expect(page.getByLabel(/Järjestys/i)).toBeVisible();
});

test("admin can edit a skill", async ({ page }) => {
  // Create
  await page.goto("/admin/skills/new");
  await page.getByLabel(/Taito/i).fill("MuokkausTaito-Playwright");
  await page.getByLabel(/Järjestys/i).fill("98");
  await page.getByRole("button", { name: "Tallenna" }).click();
  await expect(page).toHaveURL("/admin/skills");

  // Click Edit
  const row = page.locator("tr", { hasText: "MuokkausTaito-Playwright" }).first();
  await row.getByRole("link", { name: /muokkaa/i }).click();
  await expect(page).toHaveURL(/\/admin\/skills\/\d+/);

  // Update skill name
  const field = page.getByLabel(/Taito/i);
  await field.clear();
  await field.fill("PäivitettyTaito-Playwright");
  await page.getByRole("button", { name: "Tallenna" }).click();
  await expect(page).toHaveURL("/admin/skills");
  await expect(page.getByText("PäivitettyTaito-Playwright")).toBeVisible();

  // Cleanup
  const updatedRow = page.locator("tr", { hasText: "PäivitettyTaito-Playwright" }).first();
  await updatedRow.getByRole("button", { name: /poista/i }).click();
  await page
    .getByRole("button", { name: /poista/i })
    .last()
    .click();
});

test("admin can create and delete a skill", async ({ page }) => {
  await page.goto("/admin/skills/new");

  await page.getByLabel(/Taito/i).fill("TestiTaito-Playwright");
  // Kategoria defaults to Frontend — no change needed
  await page.getByLabel(/Järjestys/i).fill("99");

  await page.getByRole("button", { name: "Tallenna" }).click();
  await expect(page).toHaveURL("/admin/skills");
  await expect(page.getByText("TestiTaito-Playwright")).toBeVisible();

  // Delete via DeleteButton (opens MUI Dialog, then confirm)
  const row = page.locator("tr", { hasText: "TestiTaito-Playwright" });
  await row.getByRole("button", { name: /poista/i }).click();
  await page
    .getByRole("button", { name: /poista/i })
    .last()
    .click();
  await expect(page.getByText("TestiTaito-Playwright")).not.toBeVisible();
});
