import { expect, test } from "@playwright/test";

test("register creates a database-backed session and logout returns to login", async ({ page }) => {
  const suffix = Date.now();
  const email = `e2e-${suffix}@example.com`;
  const displayName = `验收用户${suffix}`;

  await page.goto("/register");
  await expect(page.getByText("创建账号")).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(750);
  await page.getByLabel("姓名").fill(displayName);
  await page.getByLabel("部门").fill("知识中台");
  await page.getByLabel("邮箱").fill(email);
  await page.getByLabel("密码").fill("Passw0rd!");
  await page.getByRole("button", { name: "创建并进入工作台" }).click();

  await expect(page.getByRole("heading", { name: /早上好/ })).toBeVisible();
  const token = await page.evaluate(() => localStorage.getItem("puhua_auth_token"));
  expect(token).toMatch(/^pk_/);
  const me = await page.evaluate(async (authToken) => {
    const response = await fetch("http://127.0.0.1:8002/me", {
      headers: { authorization: `Bearer ${authToken}` },
    });
    return response.json();
  }, token);
  expect(me.displayName).toBe(displayName);

  await page.getByRole("button", { name: "退出登录" }).click();
  await expect(page.getByText("登录").first()).toBeVisible();
});

test("login rejects invalid credentials with visible feedback", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(750);
  await page.getByLabel("邮箱").fill("missing@example.com");
  await page.getByLabel("密码").fill("wrong-password");
  await page.getByRole("button", { name: "登录工作台" }).click();

  await expect(page.getByText("邮箱或密码不正确")).toBeVisible();
});

test("quick login account signs in without manual password entry", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("admin@puhua.local")).toBeVisible();
  await expect(page.getByText("Puhua@2026")).toBeVisible();

  await page.getByRole("button", { name: "一键登录" }).click();

  await expect(page.getByRole("heading", { name: /早上好/ })).toBeVisible();
  await expect(page.getByText("李晓楠").first()).toBeVisible();
});
