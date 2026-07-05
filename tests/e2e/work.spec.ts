import { test, expect } from "@playwright/test";

// ── Public /work page ───────────────────────────────────────────────────────

test("/work page loads", async ({ page }) => {
  const response = await page.goto("/work");
  expect(response?.status()).toBeLessThan(400);
});

test("/work shows page heading", async ({ page }) => {
  await page.goto("/work");
  await expect(
    page.getByRole("heading", { name: /Työkokemus|Work Experience/i }).first()
  ).toBeVisible();
});

// ── Admin work CRUD ─────────────────────────────────────────────────────────

test.describe("Admin work", () => {
  test.use({ storageState: "tests/e2e/.auth/admin.json" });

  test("admin work list page loads", async ({ page }) => {
    await page.goto("/admin/work");
    await expect(page.getByRole("heading", { name: /Työkokemukset/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Lisää uusi/i })).toBeVisible();
  });

  test("admin can navigate to new work form", async ({ page }) => {
    await page.goto("/admin/work");
    await page.getByRole("link", { name: /Lisää uusi/i }).click();
    await expect(page).toHaveURL("/admin/work/new");
    await expect(page.getByRole("heading", { name: /Lisää työkokemus/i })).toBeVisible();
  });

  test("new work form has required fields", async ({ page }) => {
    await page.goto("/admin/work/new");
    await expect(page.getByLabel(/Yritys \(FI\)/i)).toBeVisible();
    await expect(page.getByLabel(/Rooli \(FI\)/i)).toBeVisible();
    await expect(page.getByLabel(/Company \(EN\)/i)).toBeVisible();
    await expect(page.getByLabel(/Role \(EN\)/i)).toBeVisible();
    await expect(page.getByLabel(/Aloituspvm/i)).toBeVisible();
  });

  test("admin can edit a work entry", async ({ page }) => {
    // Create
    await page.goto("/admin/work/new");
    await page.getByLabel(/Yritys \(FI\)/i).fill("Muokkaustestiyritys FI");
    await page.getByLabel(/Company \(EN\)/i).fill("Edit Test Company EN");
    await page.getByLabel(/Rooli \(FI\)/i).fill("Testirooli");
    await page.getByLabel(/Role \(EN\)/i).fill("Test Role");
    await page.getByLabel(/Aloituspvm/i).fill("2020-01");
    await page.getByRole("button", { name: "Tallenna" }).click();
    await expect(page).toHaveURL("/admin/work");

    // Click Edit for the new row
    const row = page.locator("tr", { hasText: "Muokkaustestiyritys FI" }).first();
    await row.getByRole("link", { name: /muokkaa/i }).click();
    await expect(page).toHaveURL(/\/admin\/work\/\d+/);

    // Update company name
    const field = page.getByLabel(/Yritys \(FI\)/i);
    await field.clear();
    await field.fill("Päivitetty Yritys FI");
    await page.getByRole("button", { name: "Tallenna" }).click();
    await expect(page).toHaveURL("/admin/work");
    await expect(page.getByRole("cell", { name: "Päivitetty Yritys FI" })).toBeVisible();

    // Cleanup
    const updatedRow = page.locator("tr", { hasText: "Päivitetty Yritys FI" }).first();
    await updatedRow.getByRole("button", { name: /poista/i }).click();
    await page
      .getByRole("button", { name: /poista/i })
      .last()
      .click();
  });

  test("admin can create and delete a work entry", async ({ page }) => {
    await page.goto("/admin/work/new");

    await page.getByLabel(/Yritys \(FI\)/i).fill("Testiyritys FI");
    await page.getByLabel(/Company \(EN\)/i).fill("Test Company EN");
    await page.getByLabel(/Rooli \(FI\)/i).fill("Testirooli FI");
    await page.getByLabel(/Role \(EN\)/i).fill("Test Role EN");
    await page.getByLabel(/Aloituspvm/i).fill("2020-01");
    await page.getByRole("button", { name: "Tallenna" }).click();

    await expect(page).toHaveURL("/admin/work");
    const cells = page.getByRole("cell", { name: "Testiyritys FI" });
    const countBefore = await cells.count();
    expect(countBefore).toBeGreaterThan(0);

    const row = page.locator("tr", { hasText: "Testiyritys FI" }).first();
    await row.getByRole("button", { name: /poista/i }).click();
    await page
      .getByRole("button", { name: /poista/i })
      .last()
      .click();
    await expect(page.getByRole("cell", { name: "Testiyritys FI" })).toHaveCount(countBefore - 1);
  });
});
