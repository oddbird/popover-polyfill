import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

expect.extend({
  async toBeFunctionalPopover(popover) {
    await expect(popover).toBeHidden();
    await expect(
      await popover.evaluate((node) => node.showPopover()),
    ).toBeUndefined();
    await expect(popover).toBeVisible();
    await expect(
      async () => await popover.evaluate((node) => node.showPopover()),
    ).rejects.toThrow(
      'DOMException: Cannot show or hide popover on invalid or already visible element',
    );
    await expect(
      await popover.evaluate((node) => node.hidePopover()),
    ).toBeUndefined();
    await expect(popover).toBeHidden();
    return { pass: true };
  },
});

test('popover as a boolean attribute', async ({ page }) => {
  const popover = (await page.locator('#popover1')).nth(0);
  await expect(popover).toBeFunctionalPopover();
});

test('popover as ""', async ({ page }) => {
  const popover = (await page.locator('#popover2')).nth(0);
  await expect(popover).toBeFunctionalPopover();
});

test('popover as "auto"', async ({ page }) => {
  const popover = (await page.locator('#popover3')).nth(0);
  await expect(popover).toBeFunctionalPopover();
});

test('popover as "manual"', async ({ page }) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeFunctionalPopover();
});

test('popover as "invalid"', async ({ page }) => {
  const popover = (await page.locator('#popover6')).nth(0);
  await expect(
    async () => await popover.evaluate((node) => node.showPopover()),
  ).rejects.toThrow(
    'DOMException: Cannot show or hide popover on invalid or already visible element',
  );
});
