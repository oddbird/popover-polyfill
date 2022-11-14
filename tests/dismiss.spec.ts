import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('click dismisses all auto/hint popovers', async ({ page }) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(popover7).toBeHidden();
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

test('click inside manual popover dismisses other auto/hint popovers', async ({
  page,
}) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(popover7).toBeHidden();
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
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeVisible();

  await popover8.evaluate((node) => node.click());
  await expect(popover7).toBeHidden();
  await expect(popover8).toBeVisible();
});

test('click inside hint popover does not dismiss itself', async ({ page }) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeVisible();

  await popover7.evaluate((node) => node.click());
  await expect(popover7).toBeVisible();
  await expect(popover8).toBeHidden();
});
