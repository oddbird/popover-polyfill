import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking button[popovertarget=manualPopover] should hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=manualPopover]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=manualPopover] twice should hide the open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#manualPopover')).nth(0);
  await page.click('button[popovertarget=manualPopover]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=manualPopover]');
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=defaultPopover] should show then hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#defaultPopover')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovertarget=defaultPopover]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=defaultPopover]');
  await expect(popover).toBeHidden();
  await page.click('button[popovertarget=defaultPopover]');
  await expect(popover).toBeVisible();
});

test('clicking element inside button[popovertarget=defaultPopover] should show then hide open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#defaultPopover')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovertarget=defaultPopover] span');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=defaultPopover] span');
  await expect(popover).toBeHidden();
  await page.click('button[popovertarget=defaultPopover] span');
  await expect(popover).toBeVisible();
});

test('clicking button[popovertarget=defaultPopover] should set button aria-expanded attribute appropriately', async ({
  page,
}) => {
  const popover = (await page.locator('#defaultPopover')).nth(0);
  const button = (
    await page.locator('button[popovertarget="defaultPopover"]')
  ).nth(0);
  await expect(popover).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await button.click();
  await expect(popover).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await button.click();
  await expect(popover).toBeHidden();
  await expect(button).toHaveAttribute('aria-expanded', 'false');
});

test('clicking button[popovertarget=singleActionShowPopover] should show open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#singleActionShowPopover')).nth(0);
  await expect(popover).toBeHidden();
  await page.click('button[popovertarget=singleActionShowPopover]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=singleActionShowPopover]');
  await expect(popover).toBeVisible();
});

test('clicking button[popovertarget=showHidePopover][popovertargetaction="show"] should show open popover', async ({
  page,
}) => {
  const popover = (await page.locator('#showHidePopover')).nth(0);
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=showHidePopover][popovertargetaction="show"]',
  );
  await expect(popover).toBeVisible();
  await page.click(
    'button[popovertarget=showHidePopover][popovertargetaction="show"]',
  );
  await expect(popover).toBeVisible();
});

test('clicking button[popovertarget=showHidePopover][popovertargetaction="hide"] should do nothing as it is already hidden', async ({
  page,
}) => {
  const popover = (await page.locator('#showHidePopover')).nth(0);
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=showHidePopover][popovertargetaction="hide"]',
  );
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=showHidePopover][popovertargetaction="hide"]',
  );
  await expect(popover).toBeHidden();
});

test('clicking button[popovertarget=showHidePopover][popovertargetaction="show"] then button[popovertarget=showHidePopover][popovertargetaction="hide"] should show and hide popover', async ({
  page,
}) => {
  const popover = (await page.locator('#showHidePopover')).nth(0);
  await expect(popover).toBeHidden();
  await page.click(
    'button[popovertarget=showHidePopover][popovertargetaction="show"]',
  );
  await expect(popover).toBeVisible();
  await page.click(
    'button[popovertarget=showHidePopover][popovertargetaction="hide"]',
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
  await page.click('button[popovertarget=shadowedNestedPopover]');
  await expect(popover).toBeVisible();
  await page.click('button[popovertarget=shadowedNestedPopover]');
  await expect(popover).toBeHidden();
});

test("button 'popovertargetElement' property should return target element", async ({
  page,
}) => {
  const popover = (await page.locator('#defaultPopover')).nth(0);
  await expect(
    await popover.evaluate((node) => {
      const button = document.querySelector('[popovertarget="defaultPopover"]');
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
  const button = (
    await page.locator('[popovertarget="invalidTargetPopover"]')
  ).nth(0);
  await expect(
    await button.evaluate((node) => node.popoverTargetElement),
  ).toBeNull();
});

test("assign an HTML element to button's 'popoverTargetElement' property should assign empty string ('') to its 'popovertarget' attribute", async ({
  page,
}) => {
  const button = (
    await page.locator('button[popovertarget=defaultPopover]')
  ).nth(0);

  await expect(
    await button.evaluate((node) => {
      const popover = document.querySelector('#defaultPopover');
      node.popoverTargetElement = popover;
      return node.getAttribute('popovertarget');
    }),
  ).toBe('');
});

test("assign null to invoker's 'popoverTargetElement' property should remove its 'popovertoggletarget' attribute", async ({
  page,
}) => {
  const button = (await page.locator('[popovertarget="defaultPopover"]')).nth(
    0,
  );
  await expect(
    await button.evaluate((node) => {
      node.popoverTargetElement = null;
      return node.getAttribute('popovertarget');
    }),
  ).toBeNull();
});

test('clicking button#crossTreeToggle should show then hide popover in a different tree scope', async ({
  page,
}) => {
  const popover = (await page.locator('#shadowedPopover')).nth(0);
  await page.click('button#crossTreeToggle');
  await expect(popover).toBeVisible();
  await page.click('button#crossTreeToggle');
  await expect(popover).toBeHidden();
});

test('clicking #shadowInInvoker should show then hide popover', async ({
  page,
}) => {
  const popover = (await page.locator('#popover12')).nth(0);
  await page.click('#shadowInInvoker');
  await expect(popover).toBeVisible();
  await page.click('#shadowInInvoker');
  await expect(popover).toBeHidden();
});
