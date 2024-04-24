import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('click dismisses all auto popovers', async ({ page }) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await testPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(testPopover).toBeVisible();
  const testPopover2 = (await page.locator('#test-popover-2')).nth(0);
  await expect(testPopover2).toBeHidden();
  const showHidePopover = (await page.locator('#showHidePopover')).nth(0);
  await expect(showHidePopover).toBeHidden();
  const manualPopover = (await page.locator('#manualPopover')).nth(0);
  await expect(manualPopover).toBeHidden();
  const shadowedPopover = (await page.locator('#shadowedPopover')).nth(0);
  await expect(shadowedPopover).toBeHidden();
  const shadowedNestedPopover = (
    await page.locator('#shadowedNestedPopover')
  ).nth(0);
  await expect(shadowedNestedPopover).toBeHidden();

  await page.click('h1');
  await expect(testPopover).toBeHidden();
  await expect(testPopover2).toBeHidden();
  await expect(showHidePopover).toBeHidden();
  await expect(manualPopover).toBeHidden();
});

test('click inside manual popover dismisses other auto popovers', async ({
  page,
}) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(testPopover).toBeHidden();
  const testPopover2 = (await page.locator('#test-popover-2')).nth(0);
  await expect(testPopover2).toBeHidden();
  const showHidePopover = (await page.locator('#showHidePopover')).nth(0);
  await expect(
    await showHidePopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(showHidePopover).toBeVisible();
  const manualPopover = (await page.locator('#manualPopover')).nth(0);
  await expect(
    await manualPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(manualPopover).toBeVisible();

  await page.click('#manualPopover');
  await expect(testPopover).toBeHidden();
  await expect(testPopover2).toBeHidden();
  await expect(showHidePopover).toBeVisible();
  await expect(manualPopover).toBeVisible();
});

test('click inside auto popover does not dismiss itself', async ({ page }) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await testPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(testPopover).toBeVisible();

  await testPopover.evaluate((node) => node.click());
  await expect(testPopover).toBeVisible();
});

test('showing an auto popover should close all other auto popovers', async ({
  page,
}) => {
  const singleActionShowPopover = (
    await page.locator('#singleActionShowPopover')
  ).nth(0);
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await singleActionShowPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(singleActionShowPopover).toBeVisible();
  await expect(testPopover).toBeHidden();
  await expect(
    await testPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(testPopover).toBeVisible();
  await expect(singleActionShowPopover).toBeHidden();
});

test('pressing Escape dismisses auto popovers', async ({ page }) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await testPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(testPopover).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(testPopover).toBeHidden();
});

test('pressing Escape focused in popover dismisses auto popovers', async ({
  page,
}) => {
  const singleActionShowPopover = (
    await page.locator('#singleActionShowPopover')
  ).nth(0);
  await expect(
    await singleActionShowPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(singleActionShowPopover).toBeVisible();
  await page.locator('#singleActionShowPopover a[href]').focus();

  await page.keyboard.press('Escape');

  await expect(singleActionShowPopover).toBeHidden();
});
