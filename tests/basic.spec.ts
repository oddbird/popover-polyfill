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
    ).rejects.toThrow('DOMException: Invalid on already-showing');
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

test('popover as "hint"', async ({ page }) => {
  const popover = (await page.locator('#popover4')).nth(0);
  await expect(popover).toBeFunctionalPopover();
});

test('popover as "manual"', async ({ page }) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeFunctionalPopover();
});

test('popover as "invalid"', async ({ page }) => {
  const popover = (await page.locator('#popover6')).nth(0);
  await expect(popover).toBeVisible();
  await expect(
    async () => await popover.evaluate((node) => node.showPopover()),
  ).rejects.toThrow(
    'DOMException: Not supported on element that does not have valid popover attribute',
  );
});
