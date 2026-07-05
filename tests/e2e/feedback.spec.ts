import { test, expect } from "@playwright/test";

test("work detail page has feedback button", async ({ page }) => {
  await page.goto("/work/2");
  await expect(page.getByText(/Jäikö jotain epäselväksi|Anything unclear/i)).toBeVisible();
});

test("feedback button expands the form", async ({ page }) => {
  await page.goto("/work/2");
  await page.getByText(/Jäikö jotain epäselväksi|Anything unclear/i).click();
  // Use getByRole textbox to avoid MUI's hidden aria shadow textarea
  await expect(page.getByRole("textbox", { name: /Viesti|Message/i })).toBeVisible();
});

test("feedback form has required fields", async ({ page }) => {
  await page.goto("/work/2");
  await page.getByText(/Jäikö jotain epäselväksi|Anything unclear/i).click();
  await expect(page.getByRole("textbox", { name: /Viesti|Message/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /lähetä|send/i }).first()).toBeVisible();
});

test("projects detail page has feedback button", async ({ page }) => {
  await page.goto("/projects/1");
  await expect(page.getByText(/Jäikö jotain epäselväksi|Anything unclear/i)).toBeVisible();
});

test("education detail page has feedback button", async ({ page }) => {
  await page.goto("/education/1");
  await expect(page.getByText(/Jäikö jotain epäselväksi|Anything unclear/i)).toBeVisible();
});

test("feedback form shows validation error for too-short message", async ({ page }) => {
  await page.goto("/work/2");
  await page.getByText(/Jäikö jotain epäselväksi|Anything unclear/i).click();
  await page.getByRole("textbox", { name: /Viesti|Message/i }).fill("Hi");
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page
      .getByRole("button", { name: /lähetä|send/i })
      .first()
      .click(),
  ]);
  await expect(page.getByText(/liian lyhyt|too short/i)).toBeVisible({ timeout: 15000 });
});

test("feedback form shows success state after valid submission", async ({ page }) => {
  await page.goto("/work/2");
  await page.getByText(/Jäikö jotain epäselväksi|Anything unclear/i).click();
  await page
    .getByRole("textbox", { name: /Viesti|Message/i })
    .fill("Tämä on testipalaute joka on tarpeeksi pitkä.");
  await Promise.all([
    page.waitForLoadState("networkidle"),
    page
      .getByRole("button", { name: /lähetä|send/i })
      .first()
      .click(),
  ]);
  await expect(page.getByText(/Kiitos palautteesta|Thank you for your feedback/i)).toBeVisible({
    timeout: 15000,
  });
});
