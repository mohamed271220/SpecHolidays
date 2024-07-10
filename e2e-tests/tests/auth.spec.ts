import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test("Should allow user to sign in", async ({ page }) => {
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  await page.locator("[name=email]").fill("2@1.com");
  await page.locator("[name=password]").fill("Abcd-1234");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Logged in successfully")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});

test("Should allow user to register", async ({ page }) => {
  const testEmail = `test-${
    Math.floor(Math.random() * 90000) + 10000
  }@test.com`;
  await page.goto(UI_URL);
  await page.getByRole("link", { name: "Sign In" }).click();
  await page.getByRole("link", { name: "Create an account here" }).click();
  await expect(
    await page.getByRole("heading", { name: "Create an account" })
  ).toBeVisible();

  await page.locator("[name=firstName]").fill("John");
  await page.locator("[name=lastName]").fill("Doe");
  await page.locator("[name=email]").fill(testEmail);
  await page.locator("[name=password]").fill("Abcd-1234");
  await page.locator("[name=confirmPassword]").fill("Abcd-1234");

  await page.getByRole("button", { name: "Create an account" }).click();

  await expect(page.getByText("Account created successfully")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Bookings" })).toBeVisible();
  await expect(page.getByRole("link", { name: "My Hotels" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign Out" })).toBeVisible();
});
