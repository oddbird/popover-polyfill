import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('click dismisses all auto/hint popups', async ({ page }) => {
  const popup7 = (await page.locator('#popup7')).nth(0);
  await expect(popup7).toBeHidden();
  const popup8 = (await page.locator('#popup8')).nth(0);
  await expect(popup8).toBeVisible();
  const popup9 = (await page.locator('#popup9')).nth(0);
  await expect(popup9).toBeHidden();
  const popup10 = (await page.locator('#popup10')).nth(0);
  await expect(popup10).toBeVisible();
  const popup11 = (await page.locator('#popup11')).nth(0);
  await expect(popup11).toBeVisible();

  await page.click('h1');
  await expect(popup8).toBeHidden();
  await expect(popup10).toBeVisible();
  await expect(popup11).toBeVisible();
});

test('click inside manual popup dismisses other auto/hint popups', async ({
  page,
}) => {
  const popup7 = (await page.locator('#popup7')).nth(0);
  await expect(popup7).toBeHidden();
  const popup8 = (await page.locator('#popup8')).nth(0);
  await expect(popup8).toBeVisible();
  const popup9 = (await page.locator('#popup9')).nth(0);
  await expect(popup9).toBeHidden();
  const popup10 = (await page.locator('#popup10')).nth(0);
  await expect(popup10).toBeVisible();
  const popup11 = (await page.locator('#popup11')).nth(0);
  await expect(popup11).toBeVisible();

  await page.click('#popup11');
  await expect(popup8).toBeHidden();
  await expect(popup10).toBeVisible();
  await expect(popup11).toBeVisible();
});

test('click inside auto popup does not dismiss itself', async ({ page }) => {
  const popup7 = (await page.locator('#popup7')).nth(0);
  await expect(
    await popup7.evaluate((node) => node.showPopUp()),
  ).toBeUndefined();
  const popup8 = (await page.locator('#popup8')).nth(0);
  await expect(popup8).toBeVisible();

  await popup8.evaluate((node) => node.click());
  await expect(popup7).toBeHidden();
  await expect(popup8).toBeVisible();
});

test('click inside hint popup does not dismiss itself', async ({ page }) => {
  const popup7 = (await page.locator('#popup7')).nth(0);
  await expect(
    await popup7.evaluate((node) => node.showPopUp()),
  ).toBeUndefined();
  await expect(popup7).toBeVisible();
  const popup8 = (await page.locator('#popup8')).nth(0);
  await expect(popup8).toBeVisible();

  await popup7.evaluate((node) => node.click());
  await expect(popup7).toBeVisible();
  await expect(popup8).toBeHidden();
});
