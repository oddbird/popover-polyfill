import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('popover emits beforetoggle before showing', async ({ page }) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await testPopover.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
      });
      node.showPopover();
      return states;
    }),
  ).toStrictEqual(['closed', 'open']);
  await expect(testPopover).toBeVisible();
});

test('popover showPopover can be prevented by cancelling beforetoggle', async ({
  page,
}) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await testPopover.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
        e.preventDefault();
      });
      node.showPopover();
      return states;
    }),
  ).toStrictEqual(['closed', 'open']);
  await expect(testPopover).toBeHidden();
});

test('popover emits beforetoggle before closing', async ({ page }) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await testPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(testPopover).toBeVisible();
  await expect(
    await testPopover.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
      });
      node.hidePopover();
      return states;
    }),
  ).toStrictEqual(['open', 'closed']);
  await expect(testPopover).toBeHidden();
});

test('popover hidePopover cannot be prevented by cancelling beforetoggle', async ({
  page,
}) => {
  const testPopover = (await page.locator('#test-popover')).nth(0);
  await expect(
    await testPopover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(testPopover).toBeVisible();
  await expect(
    await testPopover.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
        e.preventDefault();
      });
      node.hidePopover();
      return states;
    }),
  ).toStrictEqual(['open', 'closed']);
  await expect(testPopover).toBeHidden();
});
