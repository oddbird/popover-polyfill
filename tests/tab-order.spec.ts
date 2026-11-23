import { expect, type Page, test } from '@playwright/test';

// The id of the focused element, looking inside shadow roots.
const activeId = (page: Page) =>
  page.evaluate(() => {
    let active = document.activeElement;
    while (active?.shadowRoot?.activeElement) {
      active = active.shadowRoot.activeElement;
    }
    return active?.id;
  });

// The popover is before its trigger in the DOM, so DOM order and popover
// order differ.
const fixtureHTML = `
  <button id="start">Start</button>
  <div id="tabPopover" popover>
    <button id="item1">Item 1</button>
    <button id="item2">Item 2</button>
  </div>
  <button id="beforeTrigger">Before trigger</button>
  <button id="trigger" popovertarget="tabPopover">Open</button>
  <button id="afterTrigger">After trigger</button>
`;

async function createFixture(page: Page, html = fixtureHTML) {
  await page.evaluate((html) => {
    const fixture = document.createElement('div');
    fixture.id = 'tabOrderFixture';
    fixture.innerHTML = html;
    document.body.append(fixture);
  }, html);
}

// Focuses `id`, presses `key` once per expected id, and checks where focus
// lands each time.
async function expectTabSequence(
  page: Page,
  id: string,
  key: 'Tab' | 'Shift+Tab',
  expected: string[],
) {
  await page.locator(`#${id}`).focus();
  for (const expectedId of expected) {
    await page.keyboard.press(key);
    expect(await activeId(page)).toBe(expectedId);
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('Tab moves from the trigger into the popover, then to the element after the trigger', async ({
  page,
}) => {
  await createFixture(page);
  await page.click('#trigger');
  await expectTabSequence(page, 'trigger', 'Tab', [
    'item1',
    'item2',
    'afterTrigger',
  ]);
});

test('Shift+Tab moves from after the trigger into the popover, then to the trigger', async ({
  page,
}) => {
  await createFixture(page);
  await page.click('#trigger');
  await expectTabSequence(page, 'afterTrigger', 'Shift+Tab', [
    'item2',
    'item1',
    'trigger',
  ]);
});

test('Tab and Shift+Tab skip the popover at its DOM position', async ({
  page,
}) => {
  await createFixture(page);
  await page.click('#trigger');
  await expectTabSequence(page, 'start', 'Tab', ['beforeTrigger']);
  await expectTabSequence(page, 'beforeTrigger', 'Shift+Tab', ['start']);
});

test('Tab from the trigger goes to the next element when the popover has nothing focusable', async ({
  page,
}) => {
  await createFixture(
    page,
    fixtureHTML.replace(/<button id="item\d">[^<]*<\/button>/g, ''),
  );
  await page.click('#trigger');
  await expectTabSequence(page, 'trigger', 'Tab', ['afterTrigger']);
});

test('popover opened with showPopover() keeps DOM order', async ({ page }) => {
  await createFixture(page);
  await page
    .locator('#tabPopover')
    .evaluate((node: HTMLElement) => node.showPopover());
  await expectTabSequence(page, 'start', 'Tab', [
    'item1',
    'item2',
    'beforeTrigger',
  ]);
});

test('popover reopened with showPopover() after closing keeps DOM order', async ({
  page,
}) => {
  await createFixture(page);
  await page.click('#trigger');
  await page.click('#trigger');
  await expect(page.locator('#tabPopover')).toBeHidden();
  await page
    .locator('#tabPopover')
    .evaluate((node: HTMLElement) => node.showPopover());
  await expectTabSequence(page, 'start', 'Tab', ['item1']);
});

// Manual popovers, because the polyfill doesn't treat an auto popover opened
// from inside another one as nested, and closes the outer one.
test('nested popover contents follow the nested trigger', async ({ page }) => {
  await createFixture(
    page,
    `
    <div id="tabPopover" popover="manual">
      <button id="item1">Item 1</button>
      <button id="innerTrigger" popovertarget="innerPopover">Open inner</button>
    </div>
    <button id="trigger" popovertarget="tabPopover">Open</button>
    <button id="afterTrigger">After trigger</button>
    <div id="innerPopover" popover="manual">
      <button id="innerItem">Inner item</button>
    </div>
  `,
  );
  await page.click('#trigger');
  await page.click('#innerTrigger');
  await expect(page.locator('#tabPopover')).toBeVisible();
  await expect(page.locator('#innerPopover')).toBeVisible();
  await expectTabSequence(page, 'trigger', 'Tab', [
    'item1',
    'innerTrigger',
    'innerItem',
    'afterTrigger',
  ]);
});

test('Tab skips a closed popover nested inside the open popover', async ({
  page,
}) => {
  await createFixture(
    page,
    `
    <div id="tabPopover" popover>
      <button id="item1">Item 1</button>
      <div id="innerPopover" popover>
        <button id="innerItem">Inner item</button>
      </div>
    </div>
    <button id="trigger" popovertarget="tabPopover">Open</button>
    <button id="afterTrigger">After trigger</button>
  `,
  );
  await page.click('#trigger');
  await expectTabSequence(page, 'trigger', 'Tab', ['item1', 'afterTrigger']);
});

test('does nothing when the author prevents the Tab keydown', async ({
  page,
}) => {
  await createFixture(page);
  await page.evaluate(() => {
    document
      .getElementById('tabOrderFixture')!
      .addEventListener('keydown', (event) => {
        if (event.key === 'Tab') event.preventDefault();
      });
  });
  await page.click('#trigger');
  await expectTabSequence(page, 'trigger', 'Tab', ['trigger']);
});

test('works inside a shadow root', async ({ page }) => {
  await page.evaluate((html) => {
    const host = document.createElement('div');
    host.attachShadow({ mode: 'open' }).innerHTML = html;
    document.body.append(host);
  }, fixtureHTML);
  await page.click('#trigger');
  await expectTabSequence(page, 'trigger', 'Tab', [
    'item1',
    'item2',
    'afterTrigger',
  ]);
  await expectTabSequence(page, 'afterTrigger', 'Shift+Tab', [
    'item2',
    'item1',
    'trigger',
  ]);
});
