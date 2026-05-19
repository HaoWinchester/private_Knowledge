import { expect, test } from "@playwright/test";

test("submit and review pages are wired to backend actions", async ({ page }) => {
  await page.goto("/submit");
  await expect(page.getByRole("heading", { name: "提交入库" })).toBeVisible();
  await page.goto("/review");
  await expect(page.getByRole("heading", { name: "审核工作台" })).toBeVisible();
  await expect(page.getByText("提交审核结果")).toBeVisible();
});
