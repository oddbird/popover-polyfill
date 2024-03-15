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
  const singleButtonPopover = (await page.locator('#singleButtonPopover')).nth(
    0,
  );
  await expect(singleButtonPopover).toBeHidden();
  const manualPopover = (await page.locator('#manualPopover')).nth(0);
  await expect(manualPopover).toBeHidden();
  const shadowedPopover = (await page.locator('#shadowedPopover')).nth(0);
  await expect(shadowedPopover).toBeHidden();
  const shadowedNestedPopover = (
    await page.locator('#shadowedNestedPopover')
  ).nth(0);
  await expect(shadowedNestedPopover).toBeHidden();

  await page.click('a');
  await expect(popover7).toBeHidden();
  await expect(popover8).toBeHidden();
  await expect(singleButtonPopover).toBeHidden();
  await expect(manualPopover).toBeHidden();
});

test('click inside manual popover dismisses other auto popovers', async ({
  page,
}) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(popover7).toBeHidden();
  const popover8 = (await page.locator('#popover8')).nth(0);
  await expect(popover8).toBeHidden();
  const singleButtonPopover = (await page.locator('#singleButtonPopover')).nth(
    0,
  );
  await expect(
    await singleButtonPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(singleButtonPopover).toBeVisible();
  const manualPopover = (await page.locator('#manualPopover')).nth(0);
  await expect(
    await manualPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(manualPopover).toBeVisible();

  await page.click('#manualPopover');
  await expect(popover7).toBeHidden();
  await expect(singleButtonPopover).toBeVisible();
  await expect(manualPopover).toBeVisible();
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
  const singleActionShowPopover = (
    await page.locator('#singleActionShowPopover')
  ).nth(0);
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await singleActionShowPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(singleActionShowPopover).toBeVisible();
  await expect(popover7).toBeHidden();
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();
  await expect(singleActionShowPopover).toBeHidden();
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
