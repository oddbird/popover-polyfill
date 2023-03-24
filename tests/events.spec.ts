import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('popover emits beforetoggle before showing', async ({ page }) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
      });
      node.showPopover();
      return states;
    }),
  ).toStrictEqual(['closed', 'open']);
  await expect(popover7).toBeVisible();
});

test('popover showPopover can be prevented by cancelling beforetoggle', async ({
  page,
}) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
        e.preventDefault();
      });
      node.showPopover();
      return states;
    }),
  ).toStrictEqual(['closed', 'open']);
  await expect(popover7).toBeHidden();
});

test('popover emits beforetoggle before closing', async ({ page }) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();
  await expect(
    await popover7.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
      });
      node.hidePopover();
      return states;
    }),
  ).toStrictEqual(['open', 'closed']);
  await expect(popover7).toBeHidden();
});

test('popover hidePopover cannot be prevented by cancelling beforetoggle', async ({
  page,
}) => {
  const popover7 = (await page.locator('#popover7')).nth(0);
  await expect(
    await popover7.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover7).toBeVisible();
  await expect(
    await popover7.evaluate((node) => {
      let states = [];
      node.addEventListener('beforetoggle', (e) => {
        states = [e.oldState, e.newState];
        e.preventDefault();
      });
      node.hidePopover();
      return states;
    }),
  ).toStrictEqual(['open', 'closed']);
  await expect(popover7).toBeHidden();
});
