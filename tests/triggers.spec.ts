import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking button[popovertarget=popover10] should hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover10')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=popover10]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=popover10] twice should hide the open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover10')).nth(0);
  await page.click('button[popovertarget=popover10]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=popover10]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=popover1] should show then hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover1')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovertarget=popover1]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=popover1]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=popover1] should set button aria-expanded attribute appropriately', async ({
  page,
}) => {
  const popover = (await page.locator('#popover1')).nth(0);
  const button = (await page.locator('button[popovertarget="popover1"]')).nth(
    0,
  );
  await expect(popover).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await expect(popover).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await button.click();
  await expect(popover).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('clicking button[popovertarget=popover3] should show open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover3')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovertarget=popover3]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=popover3]');
  await expect(popover).toBeVisible();
});

test('clicking button[popovertarget=popover5][popovertargetaction="show"] should show open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=popover5][popovertargetaction="show"]',
  );
  await expect(popover).toBeVisible();
  await page.click(
    'button[popovertarget=popover5][popovertargetaction="show"]',
  );
  await expect(popover).toBeVisible();
});

test('clicking button[popovertarget=popover5][popovertargetaction="hide"] should do nothing as it is already hidden', async ({
  page,
}) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=popover5][popovertargetaction="hide"]',
  );
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=popover5][popovertargetaction="hide"]',
  );
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=popover5][popovertargetaction="show"] then button[popovertarget=popover5][popovertargetaction="hide"] should show and hide popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover5')).nth(0);
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=popover5][popovertargetaction="show"]',
  );
  await expect(popover).toBeVisible();
  await page.click(
    'button[popovertarget=popover5][popovertargetaction="hide"]',
  );
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=shadowedPopover] should hide open popover in the same (shadow) tree scope', async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=shadowedPopover]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=shadowedNestedPopover] should hide open nested popover in the same (shadow) tree scope', async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedNestedPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=shadowedNestedPopover]');
  await expect(popover).toBeHidden();
});

test("button 'popovertargetElement' property should return target element", async ({
  page,
}) => {
  const popover = (await page.locator('#popover1')).nth(0);
  await expect(
    await popover.evaluate((node) => {
      const button = document.querySelector('[popovertarget="popover1"]');
      return button?.popoverTargetElement === node;
    }),
  ).toBe(true);
});

test("button's 'popoverTargetElement' property should return target element across different tree scope", async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedPopover')).nth(0);
  await expect(
    await popover.evaluate((node) => {
      const button = document.getElementById('crossTreeToggle');
      return button.popoverTargetElement === node;
    }),
  ).toBe(true);
});

test("assign invalid value to button's 'popoverTargetElement' property should fail returning its target element", async ({
  page,
}) => {
  const button = (await page.locator('[popovertarget="notExist"]')).nth(0);
  await expect(
    await button.evaluate((node) => node.popoverTargetElement),
  ).toBeNull();
});

test("assign an HTML element to button's 'popoverTargetElement' property should assign empty string ('') to its 'popovertarget' attribute", async ({
  page,
}) => {
  const button = (await page.locator('button[popovertarget=popover1]')).nth(0);

  await expect(
    await button.evaluate((node) => {
      const popover = document.querySelector('#popover1');
      node.popoverTargetElement = popover;
      return node.getAttribute('popovertarget');
    }),
  ).toBe('');
});

test("assign null to invoker's 'popoverTargetElement' property should remove its 'popovertoggletarget' attribute", async ({
  page,
}) => {
  const button = (await page.locator('[popovertarget="popover1"]')).nth(0);
  await expect(
    await button.evaluate((node) => {
      node.popoverTargetElement = null;
      return node.getAttribute('popovertarget');
    }),
  ).toBeNull();
});

test('clicking button#crossTreeToggle then button#crossTreeToggle twice should show and hide popover in a different tree scope', async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedPopover')).nth(0);
  await page.click('button#crossTreeToggle');
  await expect(popover).toBeVisible();
  await page.click('button#crossTreeToggle');
  await expect(popover).toBeHidden();
});
