import { test, expect } from "@playwright/test";

test("homepage loads and shows hero", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/./);
  await expect(page.locator("h1")).toBeVisible();
});

test("products page loads", async ({ page }) => {
  await page.goto("/products");
  await expect(page.locator("h1")).toBeVisible();
});
