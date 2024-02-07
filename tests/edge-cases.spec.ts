import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test("removing an autoPopover from document doesn't crash page", async ({
  page,
}) => {
  const popover = (await page.locator('#popover1')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await expect(await popover.evaluate((node) => node.remove())).toBeUndefined();
  const popover2 = (await page.locator('#popover2')).nth(0);
  await expect(
    await popover2.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover2).toBeVisible();
});

test('styles in layers are winning over polyfilled styles', async ({
  page,
}) => {
  const popover = (await page.locator('#popover13')).nth(0);
  await expect(popover).toHaveCSS('background-color', 'rgb(208, 13, 30)');
});
