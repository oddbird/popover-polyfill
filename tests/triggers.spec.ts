import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking button[popuptoggletarget=popup11] should hide open popup', async ({
  page,
}) => {
  const popup = (await page.locator('#popup11')).nth(0);
  await expect(popup).toBeVisible();
  await page.click('button[popuptoggletarget=popup11]');
  await expect(popup).toBeHidden();
});

test('clicking button[popuptoggletarget=popup11] twice should hide the open popup', async ({
  page,
}) => {
  const popup = (await page.locator('#popup11')).nth(0);
  await expect(popup).toBeVisible();
  await page.click('button[popuptoggletarget=popup11]');
  await expect(popup).toBeHidden();
  await page.click('button[popuptoggletarget=popup11]');
  await expect(popup).toBeVisible();
});

test('clicking button[popuptoggletarget=popup1] should show then hide open popup', async ({
  page,
}) => {
  const popup = (await page.locator('#popup1')).nth(0);
  await expect(popup).toBeHidden();
  await page.click('button[popuptoggletarget=popup1]');
  await expect(popup).toBeVisible();
  await page.click('button[popuptoggletarget=popup1]');
  await expect(popup).toBeHidden();
});

test('clicking button[popupshowtarget=popup3] should show open popup', async ({
  page,
}) => {
  const popup = (await page.locator('#popup3')).nth(0);
  await expect(popup).toBeHidden();
  await page.click('button[popupshowtarget=popup3]');
  await expect(popup).toBeVisible();
  await page.click('button[popupshowtarget=popup3]');
  await expect(popup).toBeVisible();
});

test('clicking button[popupshowtarget=popup5] should show open popup', async ({
  page,
}) => {
  const popup = (await page.locator('#popup5')).nth(0);
  await expect(popup).toBeHidden();
  await page.click('button[popupshowtarget=popup5]');
  await expect(popup).toBeVisible();
  await page.click('button[popupshowtarget=popup5]');
  await expect(popup).toBeVisible();
});

test('clicking button[popuphidetarget=popup5] should do nothing as it is already hidden', async ({
  page,
}) => {
  const popup = (await page.locator('#popup5')).nth(0);
  await expect(popup).toBeHidden();
  await page.click('button[popuphidetarget=popup5]');
  await expect(popup).toBeHidden();
  await page.click('button[popuphidetarget=popup5]');
  await expect(popup).toBeHidden();
});

test('clicking button[popupshowtarge=popup5] then button[popuphidetarget=popup5] should show and hide popup', async ({
  page,
}) => {
  const popup = (await page.locator('#popup5')).nth(0);
  await expect(popup).toBeHidden();
  await page.click('button[popupshowtarget=popup5]');
  await expect(popup).toBeVisible();
  await page.click('button[popuphidetarget=popup5]');
  await expect(popup).toBeHidden();
});
