import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking button[popovertoggletarget=popover11] should hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover11')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertoggletarget=popover11]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertoggletarget=popover11] twice should hide the open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover11')).nth(0);
  await page.click('button[popovertoggletarget=popover11]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertoggletarget=popover11]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertoggletarget=popover1] should show then hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover1')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovertoggletarget=popover1]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertoggletarget=popover1]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovershowtarget=popover3] should show open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover3')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovershowtarget=popover3]');
  await expect(popover).toBeVisible();
  await page.click('button[popovershowtarget=popover3]');
  await expect(popover).toBeVisible();
});

test('clicking button[popovershowtarget=popover5] should show open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovershowtarget=popover5]');
  await expect(popover).toBeVisible();
  await page.click('button[popovershowtarget=popover5]');
  await expect(popover).toBeVisible();
});

test('clicking button[popoverhidetarget=popover5] should do nothing as it is already hidden', async ({
  page,
}) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popoverhidetarget=popover5]');
  await expect(popover).toBeHidden();
  await page.click('button[popoverhidetarget=popover5]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovershowtarge=popover5] then button[popoverhidetarget=popover5] should show and hide popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovershowtarget=popover5]');
  await expect(popover).toBeVisible();
  await page.click('button[popoverhidetarget=popover5]');
  await expect(popover).toBeHidden();
});
