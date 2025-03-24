import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test("removing an autoPopover from document doesn't crash page", async ({
  page,
}) => {
  const popover = (await page.locator('#defaultPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await expect(await popover.evaluate((node) => node.remove())).toBeUndefined();
  const emptyStatePopover = (await page.locator('#emptyStatePopover')).nth(0);
  await expect(
    await emptyStatePopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(emptyStatePopover).toBeVisible();
});

test('styles in layers are winning over polyfilled styles', async ({
  page,
}) => {
  const popover = (await page.locator('#layeredStylesPopover')).nth(0);
  await expect(popover).toHaveCSS('--border-color', '#d00d1e');
});
