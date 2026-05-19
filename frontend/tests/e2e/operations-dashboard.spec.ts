import { expect, test } from "@playwright/test";

test("operations dashboard renders backend summary sections", async ({ page }) => {
  await page.goto("/operations");
  await expect(page.getByRole("heading", { name: "知识运营看板" })).toBeVisible();
  await expect(page.getByText("质量评分分布")).toBeVisible();
  await expect(page.getByText("即将过期（30 天内）")).toBeVisible();
});
