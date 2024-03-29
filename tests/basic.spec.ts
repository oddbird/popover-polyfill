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
      await popover.evaluate((node) => node.matches(':popover-open')),
    ).toEqual(true);
    await expect(
      await popover.evaluate((node) => node.closest(':popover-open') === node),
    ).toEqual(true);
    await expect(
      await popover.evaluate((node) => node.matches(':not(:popover-open)')),
    ).toEqual(false);
    await expect(
      await popover.evaluate(
        () => document.querySelectorAll(':popover-open').length,
      ),
    ).toEqual(1);
    await expect(
      await popover.evaluate((node) => node.hidePopover()),
    ).toBeUndefined();
    await expect(popover).toBeHidden();
    await expect(
      await popover.evaluate((node) => node.matches(':popover-open')),
    ).toEqual(false);
    await expect(
      await popover.evaluate((node) => node.matches(':not(:popover-open)')),
    ).toEqual(true);
    await expect(
      await popover.evaluate(
        (node) => node.closest(':not(:popover-open)') === node,
      ),
    ).toEqual(true);
    await expect(
      await popover.evaluate(
        () => document.querySelectorAll(':popover-open').length,
      ),
    ).toEqual(0);
    await expect(
      await popover.evaluate(
        () => document.querySelectorAll('[popover]:popover-open').length,
      ),
    ).toEqual(0);
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
  await expect(popover).toBeFunctionalPopover();
});
