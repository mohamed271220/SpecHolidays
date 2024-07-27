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

test("Should allow user to create a hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/add-hotel`);
  await page.locator("[name=name]").fill("Hotel 1");
  await page.locator("[name=description]").fill("Description 1");
  await page.locator("[name=city]").fill("City 1");
  await page.locator("[name=country]").fill("Country 1");
  await page.locator("[name=pricePerNight]").fill("100");
  await page.selectOption("select[name=starRating]", { value: "5" });
  await page.getByText("Budget").click();
  await page.getByLabel("Free wifi").click();
  await page.getByLabel("Parking").click();
  await page.locator('[name="adultCount"]').fill("2");
  await page.locator('[name="childCount"]').fill("2");
  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files/1.jpg"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  // Wait for the success message to appear with an increased timeout
  await expect(page.getByText("Hotel added successfully")).toBeVisible({
    timeout: 10000,
  });
});

test("Should allow user to view hotels", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);

  await expect(page.getByText("Dublin Getaways")).toBeVisible();
  await expect(
    page.getByText(
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultricies sodales rhoncus"
    )
  ).toBeVisible();
  await expect(page.getByText("Dublin, Ireland")).toBeVisible();
  await expect(page.getByText("119$ per night")).toBeVisible();
  await expect(page.getByText("All Inclusive")).toBeVisible();
  await expect(page.getByText("2 adults, 3 children")).toBeVisible();
  await expect(page.getByText("2 Star rating")).toBeVisible();

  await expect(page.getByRole("link", { name: "Add Hotel" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Edit" }).first()).toBeVisible();
});

test("should edit hotel", async ({ page }) => {
  await page.goto(`${UI_URL}/my-hotels`);
  await page.getByRole("link", { name: "Edit" }).first().click();
  await page.waitForSelector("[name=name]", { state: "attached" });
  await expect(page.locator("[name=name]")).toHaveValue("Hotel 1");
  await page.locator("[name=name]").fill("Dublin Getaways Updated");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel saved!")).toBeVisible();
  // Reset the hotel name
  await page.reload();
  await page.waitForSelector("[name=name]", { state: "attached" });
  await expect(page.locator("[name=name]")).toHaveValue(
    "Dublin Getaways Updated"
  );
  await page.locator("[name=name]").fill("Hotel 1");
  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Hotel saved!")).toBeVisible();
});
