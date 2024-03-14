import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('click dismisses all auto popovers', async ({ page }) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeHidden();
  const popover9 = (await page.locator('#popover9')).nth(0);
  await expect(popover9).toBeHidden();
  const popover10 = (await page.locator('#popover10')).nth(0);
  await expect(popover10).toBeHidden();
  const shadowedPopover = (await page.locator('#shadowedPopover')).nth(0);
  await expect(shadowedPopover).toBeHidden();
  const shadowedNestedPopover = (
    await page.locator('#shadowedNestedPopover')
  ).nth(0);
  await expect(shadowedNestedPopover).toBeHidden();

  await page.click('a');
  await expect(popover7).toBeHidden();
  await expect(popover8).toBeHidden();
  await expect(popover9).toBeHidden();
  await expect(popover10).toBeHidden();
});

test('click inside manual popover dismisses other auto popovers', async ({
  page,
}) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(popover7).toBeHidden();
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeHidden();
  const popover9 = (await page.locator('#popover9')).nth(0);
  await expect(
    await popover9.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover9).toBeVisible();
  const popover10 = (await page.locator('#popover10')).nth(0);
  await expect(
    await popover10.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover10).toBeVisible();

  await page.click('#popover10');
  await expect(popover7).toBeHidden();
  await expect(popover9).toBeVisible();
  await expect(popover10).toBeVisible();
});

test('click inside auto popover does not dismiss itself', async ({ page }) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();

  await popover7.evaluate((node) => node.click());
  await expect(popover7).toBeVisible();
});

test('showing an auto popover should close all other auto popovers', async ({
  page,
}) => {
  const popover3 = (await page.locator('#popover3')).nth(0);
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover3.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover3).toBeVisible();
  await expect(popover7).toBeHidden();
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();
  await expect(popover3).toBeHidden();
});

test('pressing Escape dismisses auto popovers', async ({ page }) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(popover7).toBeHidden();
});

test('pressing Escape focused in popover dismisses auto popovers', async ({
  page,
}) => {
  const popover3 = (await page.locator('#popover3')).nth(0);
  await expect(
    await popover3.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover3).toBeVisible();
  await page.locator('#popover3 a[href]').focus();

  await page.keyboard.press('Escape');

  await expect(popover3).toBeHidden();
});
