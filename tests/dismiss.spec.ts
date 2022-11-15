import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('click dismisses all auto popovers', async ({ page }) => {
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeVisible();
  const popover9 = (await page.locator('#popover9')).nth(0);
  await expect(popover9).toBeHidden();
  const popover10 = (await page.locator('#popover10')).nth(0);
  await expect(popover10).toBeVisible();
  const popover11 = (await page.locator('#popover11')).nth(0);
  await expect(popover11).toBeVisible();

  await page.click('h1');
  await expect(popover8).toBeHidden();
  await expect(popover10).toBeVisible();
  await expect(popover11).toBeVisible();
});

test('click inside manual popover dismisses other auto popovers', async ({
  page,
}) => {
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeVisible();
  const popover9 = (await page.locator('#popover9')).nth(0);
  await expect(popover9).toBeHidden();
  const popover10 = (await page.locator('#popover10')).nth(0);
  await expect(popover10).toBeVisible();
  const popover11 = (await page.locator('#popover11')).nth(0);
  await expect(popover11).toBeVisible();

  await page.click('#popover11');
  await expect(popover8).toBeHidden();
  await expect(popover10).toBeVisible();
  await expect(popover11).toBeVisible();
});

test('click inside auto popover does not dismiss itself', async ({ page }) => {
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeVisible();

  await popover8.evaluate((node) => node.click());
  await expect(popover8).toBeVisible();
});
