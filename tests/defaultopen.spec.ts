import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('defaultopen should open on page load', async ({ page }) => {
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeVisible();
  const popover9 = (await page.locator('#popover9')).nth(0);
  await expect(popover9).toBeHidden();
  const popover10 = (await page.locator('#popover10')).nth(0);
  await expect(popover10).toBeVisible();
  const popover11 = (await page.locator('#popover11')).nth(0);
  await expect(popover11).toBeVisible();
});

test('defaultOpen prop should true if attribute present', async ({ page }) => {
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(await popover8.evaluate((node) => node.defaultOpen)).toBe(true);

  const popover9 = (await page.locator('#popover9')).nth(0);
  await expect(await popover9.evaluate((node) => node.defaultOpen)).toBe(true);

  const popover10 = (await page.locator('#popover10')).nth(0);
  await expect(await popover10.evaluate((node) => node.defaultOpen)).toBe(true);

  const popover11 = (await page.locator('#popover11')).nth(0);
  await expect(await popover11.evaluate((node) => node.defaultOpen)).toBe(true);
});
