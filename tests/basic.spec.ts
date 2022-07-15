import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

expect.extend({
  async toBeFunctionalPopup(popup) {
    await expect(popup).toBeHidden()
    await expect(await popup.evaluate(node => node.showPopUp())).toBeUndefined()
    await expect(popup).toBeVisible()
    await expect(async () => await popup.evaluate(node => node.showPopUp()))
      .rejects.toThrow('DOMException: Invalid on already-showing')
    await expect(await popup.evaluate(node => node.hidePopUp())).toBeUndefined()
    await expect(popup).toBeHidden()
    return { pass: true }
  }
})

test('popup as a boolean attribute', async ({ page }) => {
  const popup = (await page.locator('#popup1')).nth(0)
  await expect(popup).toBeFunctionalPopup()
})

test('popup as ""', async ({ page }) => {
  const popup = (await page.locator('#popup2')).nth(0)
  await expect(popup).toBeFunctionalPopup()
})

test('popup as "auto"', async ({ page }) => {
  const popup = (await page.locator('#popup3')).nth(0)
  await expect(popup).toBeFunctionalPopup()
})

test('popup as "hint"', async ({ page }) => {
  const popup = (await page.locator('#popup4')).nth(0)
  await expect(popup).toBeFunctionalPopup()
})

test('popup as "manual"', async ({ page }) => {
  const popup = (await page.locator('#popup5')).nth(0)
  await expect(popup).toBeFunctionalPopup()
})

test('popup as "invalid"', async ({ page }) => {
  const popup = (await page.locator('#popup6')).nth(0)
  await expect(popup).toBeVisible()
  await expect(async () => await popup.evaluate(node => node.showPopUp()))
    .rejects.toThrow('DOMException: Not supported on element that does not have valid popup attribute')
})
