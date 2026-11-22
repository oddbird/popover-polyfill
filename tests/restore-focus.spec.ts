import { expect, type Page, test } from '@playwright/test';

// Spec: https://html.spec.whatwg.org/#hide-popover-algorithm
// When a popover is hidden, focus only moves back to the previously focused
// element if focus is currently inside the popover.

async function setup(page: Page, { shadow = false } = {}) {
  await page.evaluate(
    ({ shadow }) => {
      const trigger = document.createElement('button');
      trigger.id = 'restoreTrigger';
      trigger.textContent = 'Trigger';
      const outside = document.createElement('input');
      outside.id = 'restoreOutside';
      const popover = document.createElement('div');
      popover.id = 'restorePopover';
      popover.setAttribute('popover', 'auto');
      popover.innerHTML = '<button id="restoreInside">Inside</button>';
      document.body.append(trigger, outside);
      if (shadow) {
        // `document.activeElement` is retargeted to the host, which is
        // outside the popover.
        const host = document.createElement('div');
        host.attachShadow({ mode: 'open' }).append(popover);
        document.body.append(host);
      } else {
        document.body.append(popover);
      }
      trigger.focus();
      popover.showPopover();
    },
    { shadow },
  );
  const popover = page.locator('#restorePopover');
  await expect(popover).toBeVisible();
  return {
    popover,
    trigger: page.locator('#restoreTrigger'),
    outside: page.locator('#restoreOutside'),
    inside: page.locator('#restoreInside'),
  };
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('pressing Escape with focus inside the popover returns focus', async ({
  page,
}) => {
  const { popover, trigger, inside } = await setup(page);
  await inside.focus();
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('pressing Escape with focus outside the popover keeps focus in place', async ({
  page,
}) => {
  const { popover, outside } = await setup(page);
  await outside.focus();
  await page.keyboard.press('Escape');
  await expect(popover).toBeHidden();
  await expect(outside).toBeFocused();
});

test('hidePopover() with focus outside the popover keeps focus in place', async ({
  page,
}) => {
  const { popover, outside } = await setup(page);
  await outside.focus();
  await popover.evaluate((node: HTMLElement) => node.hidePopover());
  await expect(popover).toBeHidden();
  await expect(outside).toBeFocused();
});

test('hidePopover() of a popover in a shadow root with focus inside returns focus', async ({
  page,
}) => {
  const { popover, trigger, inside } = await setup(page, { shadow: true });
  await inside.focus();
  await popover.evaluate((node: HTMLElement) => node.hidePopover());
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('hidePopover() of a popover in a closed shadow root with focus inside returns focus', async ({
  page,
}) => {
  const restored = await page.evaluate(() => {
    const trigger = document.createElement('button');
    const host = document.createElement('div');
    document.body.append(trigger, host);
    const root = host.attachShadow({ mode: 'closed' });
    const popover = document.createElement('div');
    popover.setAttribute('popover', 'auto');
    const inside = document.createElement('button');
    popover.append(inside);
    root.append(popover);
    trigger.focus();
    popover.showPopover();
    inside.focus();
    popover.hidePopover();
    return document.activeElement === trigger;
  });
  expect(restored).toBe(true);
});

test('pressing Escape in a nested popover returns focus to the first trigger', async ({
  page,
}) => {
  const { trigger } = await setup(page);
  await page.evaluate(() => {
    const parent = document.getElementById('restorePopover')!;
    const nested = document.createElement('div');
    nested.id = 'restoreNestedPopover';
    nested.setAttribute('popover', 'auto');
    nested.innerHTML = '<button id="restoreNestedInside">Nested</button>';
    parent.append(nested);
    document.getElementById('restoreInside')!.focus();
    nested.showPopover();
  });
  const nested = page.locator('#restoreNestedPopover');
  await expect(nested).toBeVisible();
  await page.locator('#restoreNestedInside').focus();
  await page.keyboard.press('Escape');
  await expect(nested).toBeHidden();
  await expect(page.locator('#restorePopover')).toBeHidden();
  await expect(trigger).toBeFocused();
});
