import { expect, test } from "@playwright/test";

test("pilot integration page renders service endpoint and policies", async ({ page }) => {
  await page.goto("/integrations");
  await expect(page.getByRole("heading", { name: "AI 应用接入" })).toBeVisible();
  await expect(page.getByText("知识服务接入端点")).toBeVisible();
  await expect(page.getByText("全局策略")).toBeVisible();
});
