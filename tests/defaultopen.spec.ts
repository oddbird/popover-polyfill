import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('defaultopen should open on page load', async ({ page }) => {
  const popup7 = (await page.locator('#popup7')).nth(0)
  await expect(popup7).toBeHidden()
  const popup8 = (await page.locator('#popup8')).nth(0)
  await expect(popup8).toBeVisible()
  const popup9 = (await page.locator('#popup9')).nth(0)
  await expect(popup9).toBeHidden()
  const popup10 = (await page.locator('#popup10')).nth(0)
  await expect(popup10).toBeVisible()
  const popup11 = (await page.locator('#popup11')).nth(0)
  await expect(popup11).toBeVisible()
})

test('defaultOpen prop should true if attribute present', async ({ page }) => {
  const popup7 = (await page.locator('#popup7')).nth(0)
  await expect(await popup7.evaluate(node => node.defaultOpen)).toBe(true)

  const popup8 = (await page.locator('#popup8')).nth(0)
  await expect(await popup8.evaluate(node => node.defaultOpen)).toBe(true)

  const popup9 = (await page.locator('#popup9')).nth(0)
  await expect(await popup9.evaluate(node => node.defaultOpen)).toBe(true)

  const popup10 = (await page.locator('#popup10')).nth(0)
  await expect(await popup10.evaluate(node => node.defaultOpen)).toBe(true)

  const popup11 = (await page.locator('#popup11')).nth(0)
  await expect(await popup11.evaluate(node => node.defaultOpen)).toBe(true)
})
