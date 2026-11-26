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

test('`popover` set via IDL before the polyfill is applied is polyfilled', async ({
  page,
}) => {
  // Set `el.popover` once the document is parsed but before the deferred
  // module script that applies the polyfill runs.
  await page.addInitScript(() => {
    document.addEventListener('readystatechange', () => {
      if (document.readyState !== 'interactive') return;
      const el = document.createElement('div');
      el.id = 'idlPopover';
      el.textContent = 'IDL popover';
      el.popover = 'auto';
      document.body.append(el);
    });
  });
  await page.goto('/');
  const popover = page.locator('#idlPopover');
  await expect(popover).toHaveAttribute('popover', 'auto');
  await expect(popover).toBeHidden();
  await popover.evaluate((node) => node.showPopover());
  await expect(popover).toBeVisible();
});
