import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking button[popovertoggletarget=popover10] should hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover10')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertoggletarget=popover10]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertoggletarget=popover10] twice should hide the open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover10')).nth(0);
  await page.click('button[popovertoggletarget=popover10]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertoggletarget=popover10]');
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

test('clicking button[popovershowtarget=popover5] then button[popoverhidetarget=popover5] should show and hide popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovershowtarget=popover5]');
  await expect(popover).toBeVisible();
  await page.click('button[popoverhidetarget=popover5]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertoggletarget=shadowedPopover] should hide open popover in the same (shadow) tree scope', async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertoggletarget=shadowedPopover]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertoggletarget=shadowedNestedPopover] should hide open nested popover in the same (shadow) tree scope', async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedNestedPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertoggletarget=shadowedNestedPopover]');
  await expect(popover).toBeHidden();
});

// test("button's 'popoverToggleTargetElement' property should return target element", async ({
//   page,
// }) => { });

// test("button's 'popoverToggleTargetElement' property should return target element across different tree scope", async ({
//   page,
// }) => { });

// test("button's invalid 'popoverToggleTargetElement' property should fail returning target element", async ({
//   page,
// }) => { });

test("clicking light tree button with 'popoverToggleTargetElement' property should open shadowed popover", async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedNestedPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button#crossTreeToggle');
  await expect(popover).toBeHidden();
});
