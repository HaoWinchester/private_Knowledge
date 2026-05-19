import { expect, test } from "@playwright/test";

test("restricted authorization page supports request and approval center", async ({ page }) => {
  await page.goto("/access");
  await expect(page.getByRole("heading", { name: "授权申请" })).toBeVisible();
  await expect(page.getByRole("button", { name: /我要申请访问/ })).toBeVisible();
});
