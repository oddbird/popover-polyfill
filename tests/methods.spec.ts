import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('showPopover opens popover', async ({ page }) => {
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
  // Does not throw an error if the popover is already open
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();
});

test('hidePopover hides popover', async ({ page }) => {
  // Arrange
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();

  // Act & Assert
  await expect(
    await popover.evaluate((node) => node.hidePopover()),
  ).toBeUndefined();
  await expect(popover).toBeHidden();
  // Does not throw an error if the popover is already closed
  await expect(
    await popover.evaluate((node) => node.hidePopover()),
  ).toBeUndefined();
  await expect(popover).toBeHidden();
});

test('togglePopover, popover hidden, force undefined', async ({ page }) => {
  // Arrange
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();

  // Act
  await expect(await popover.evaluate((node) => node.togglePopover())).toBe(
    true,
  );
  await expect(popover).toBeVisible();
});

test('togglePopover, popover hidden, force=true', async ({ page }) => {
  // Arrange
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();

  // Act
  await expect(
    await popover.evaluate((node) => node.togglePopover({ force: true })),
  ).toBe(true);
  await expect(popover).toBeVisible();
});

test('togglePopover, popover hidden, force=false', async ({ page }) => {
  // Arrange
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();

  // Act
  await expect(
    await popover.evaluate((node) => node.togglePopover({ force: false })),
  ).toBe(false);
  await expect(popover).toBeHidden();
});

test('togglePopover, popover shown, force undefined', async ({ page }) => {
  // Arrange
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();

  // Act
  await expect(await popover.evaluate((node) => node.togglePopover())).toBe(
    false,
  );
  await expect(popover).toBeHidden();
});

test('togglePopover, popover shown, force=true', async ({ page }) => {
  // Arrange
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();

  // Act
  await expect(
    await popover.evaluate((node) => node.togglePopover({ force: true })),
  ).toBe(true);
  await expect(popover).toBeVisible();
});

test('togglePopover, popover shown, force=false', async ({ page }) => {
  // Arrange
  const popover = (await page.locator('#manualPopover')).nth(0);
  await expect(popover).toBeHidden();
  await expect(
    await popover.evaluate((node) => node.showPopover()),
  ).toBeUndefined();
  await expect(popover).toBeVisible();

  // Act
  await expect(
    await popover.evaluate((node) => node.togglePopover({ force: false })),
  ).toBe(false);
  await expect(popover).toBeHidden();
});
