import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("2@1.com");
  await page.locator("[name=password]").fill("Abcd-1234");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Logged in successfully")).toBeVisible();
});

test("Should show hotel search results", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Hotels found in Dublin")).toBeVisible();
  await expect(page.getByText("Dublin Getaways").first()).toBeVisible();
});

test("Should show hotel details", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByPlaceholder("Where are you going?").fill("Dublin");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByText("Dublin Getaways").first().click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book Now" })).toBeVisible();

});
