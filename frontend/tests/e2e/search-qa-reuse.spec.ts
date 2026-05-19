import { expect, test } from "@playwright/test";

test("library search and qa journey render backend-capable controls", async ({ page }) => {
  await page.goto("/library");
  await page.getByPlaceholder("关键词 / 标签 / 客户 / 项目").fill("央企");
  await expect(page.getByText("共")).toBeVisible();

  await page.goto("/ai-chat");
  await expect(page.getByPlaceholder(/向企业知识库提问/)).toBeVisible();
});
