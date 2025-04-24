import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});
function getSelectors(page) {
  const section = page.locator('#popover-hint');
  return {
    section,
    hintButton: section.getByRole('button', {
      name: 'Hover to toggle Hint Popover 1',
    }),
    hintButton2: section.getByRole('button', {
      name: 'Hover to toggle Hint Popover 2',
    }),
    autoButton: section.getByRole('button', { name: 'Show Auto Popover' }),
  };
}

test('hints are light dismissed', async ({ page }) => {
  const { hintButton, section } = getSelectors(page);
  hintButton.hover();

  const popover = page.locator('#hintPopover');
  await expect(popover).toBeVisible();

  section.click();
  await expect(popover).toBeHidden();
});

test('opening hint closes other hint', async ({ page }) => {
  const { hintButton, hintButton2 } = getSelectors(page);
  hintButton.hover();

  const popover = page.locator('#hintPopover');
  await expect(popover).toBeVisible();

  hintButton2.hover();
  const popover2 = page.locator('#hintPopover2');
  await expect(popover2).toBeVisible();
  await expect(popover).toBeHidden();
});

test('opening hint does not close auto', async ({ page }) => {
  const { hintButton, autoButton } = getSelectors(page);
  autoButton.click();

  const autoPopover = page.locator('#autoPopover');
  await expect(autoPopover).toBeVisible();

  hintButton.hover();
  const hintPopover = page.locator('#hintPopover');
  await expect(hintPopover).toBeVisible();
  await expect(autoPopover).toBeVisible();
});

test('opening hint nested in auto closes other hints', async ({ page }) => {
  const { hintButton, autoButton } = getSelectors(page);

  autoButton.click();

  const autoPopover = page.locator('#autoPopover');
  await expect(autoPopover).toBeVisible();

  hintButton.hover();
  const hintPopover = page.locator('#hintPopover');
  await expect(hintPopover).toBeVisible();

  const nestedHintButton = page.getByRole('button', {
    name: 'Hover to toggle Nested hint popover',
  });
  nestedHintButton.hover();

  const nestedHintPopover = page.locator('#hintPopover3');
  await expect(nestedHintPopover).toBeVisible();
  await expect(hintPopover).toBeHidden();
});

test('opening hint does not close hint nested in auto', async ({ page }) => {
  const { hintButton, autoButton } = getSelectors(page);

  autoButton.click();

  const autoPopover = page.locator('#autoPopover');
  await expect(autoPopover).toBeVisible();

  const nestedHintButton = page.getByRole('button', {
    name: 'Hover to toggle Nested hint popover',
  });
  nestedHintButton.hover();

  const nestedHintPopover = page.locator('#hintPopover3');
  await expect(nestedHintPopover).toBeVisible();

  hintButton.hover();
  const hintPopover = page.locator('#hintPopover');
  await expect(hintPopover).toBeVisible();
  await expect(nestedHintPopover).toBeVisible();
});

test('closing hint does not close hint nested in auto', async ({ page }) => {
  const { hintButton, hintButton2, autoButton } = getSelectors(page);

  autoButton.click();

  const autoPopover = page.locator('#autoPopover');
  await expect(autoPopover).toBeVisible();

  const nestedHintButton = page.getByRole('button', {
    name: 'Hover to toggle Nested hint popover',
  });
  nestedHintButton.hover();

  const nestedHintPopover = page.locator('#hintPopover3');
  await expect(nestedHintPopover).toBeVisible();

  // Show unrelated hint
  hintButton.hover();
  const hintPopover = page.locator('#hintPopover');
  await expect(hintPopover).toBeVisible();
  await expect(nestedHintPopover).toBeVisible();

  // Show a different unrelated hint to hide the first one
  hintButton2.hover();
  await expect(hintPopover).toBeHidden();
  await expect(nestedHintPopover).toBeVisible();
});

test('closing hint nested in auto closes unrelated hints', async ({ page }) => {
  const { hintButton, autoButton } = getSelectors(page);

  autoButton.click();

  const autoPopover = page.locator('#autoPopover');
  await expect(autoPopover).toBeVisible();

  const nestedHintButton = page.getByRole('button', {
    name: 'Hover to toggle Nested hint popover',
  });
  nestedHintButton.hover();

  const nestedHintPopover = page.locator('#hintPopover3');
  await expect(nestedHintPopover).toBeVisible();

  // Show unrelated hint
  hintButton.hover();
  const hintPopover = page.locator('#hintPopover');
  await expect(hintPopover).toBeVisible();
  await expect(nestedHintPopover).toBeVisible();

  // Hide nested hint
  nestedHintButton.hover();
  await expect(hintPopover).toBeHidden();
  await expect(nestedHintPopover).toBeHidden();
});

test('closing auto hides nested hints', async ({ page }) => {
  const { autoButton } = getSelectors(page);

  autoButton.click();

  const autoPopover = page.locator('#autoPopover');
  await expect(autoPopover).toBeVisible();

  const nestedHintButton = page.getByRole('button', {
    name: 'Hover to toggle Nested hint popover',
  });
  nestedHintButton.hover();

  const nestedHintPopover = page.locator('#hintPopover3');
  await expect(nestedHintPopover).toBeVisible();

  autoButton.click();
  await expect(nestedHintPopover).toBeHidden();
});
