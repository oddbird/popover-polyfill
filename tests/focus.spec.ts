import { expect, type Locator, type Page, test } from '@playwright/test';

const activeElementTag = (page: Page) =>
  page.evaluate(() => document.activeElement?.tagName);

const showPopover = (popover: Locator) =>
  popover.evaluate((node: HTMLElement) => node.showPopover());

// Waiting for next frame so browser doesn't handle autofocus automatically.
const waitForNextFrame = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );

// Creates a popover. See the note above `waitForNextFrame`.
async function createPopover(
  page: Page,
  {
    tag = 'div',
    innerHTML,
    tabIndex,
  }: { tag?: 'div' | 'dialog'; innerHTML: string; tabIndex?: number },
) {
  await page.evaluate(
    ({ tag, innerHTML, tabIndex }) => {
      const popover = document.createElement(tag);
      popover.id = 'testPopover';
      popover.setAttribute('popover', '');
      if (tabIndex !== undefined) popover.tabIndex = tabIndex;
      popover.innerHTML = innerHTML;
      document.body.append(popover);
    },
    { tag, innerHTML, tabIndex },
  );
  await waitForNextFrame(page);
  return page.locator('#testPopover');
}

async function createShadowHostPopover(
  page: Page,
  {
    delegatesFocus,
    shadowHTML,
    lightHTML = '',
    hostAutofocus = false,
  }: {
    delegatesFocus: boolean;
    shadowHTML: string;
    lightHTML?: string;
    // Adds `autofocus` and `tabindex="-1"` to the host.
    hostAutofocus?: boolean;
  },
) {
  await page.evaluate(
    ({ delegatesFocus, shadowHTML, lightHTML, hostAutofocus }) => {
      const host = document.createElement('div');
      host.id = 'shadowHostPopover';
      host.setAttribute('popover', '');
      if (hostAutofocus) {
        host.setAttribute('autofocus', '');
        host.tabIndex = -1;
      }
      host.innerHTML = lightHTML;
      const root = host.attachShadow({ mode: 'open', delegatesFocus });
      root.innerHTML = shadowHTML;
      document.body.append(host);
    },
    { delegatesFocus, shadowHTML, lightHTML, hostAutofocus },
  );
  await waitForNextFrame(page);
  return page.locator('#shadowHostPopover');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('clicking button[popovertarget="menuPopover"] should open the popover without moving focus', async ({
  page,
}) => {
  const button = page.locator('button[popovertarget="menuPopover"]');
  const popover = page.locator('#menuPopover');
  await button.click();
  await expect(popover).toBeVisible();
  await expect(button).toBeFocused();
});

test('clicking button[popovertarget="singleActionShowPopover"] should focus the autofocus element', async ({
  page,
}) => {
  const button = page.locator(
    'button[popovertarget="singleActionShowPopover"]',
  );
  const popover = page.locator('#singleActionShowPopover');
  await button.click();
  await expect(popover).toBeVisible();
  await expect(popover.locator('a[autofocus]')).toBeFocused();
});

test('clicking button[popovertarget="showHidePopover"] should focus the autofocus element', async ({
  page,
}) => {
  const button = page.locator(
    'button[popovertarget="showHidePopover"][popovertargetaction="show"]',
  );
  const popover = page.locator('#showHidePopover');
  await button.click();
  await expect(popover).toBeVisible();
  await expect(popover.locator('a[autofocus]')).toBeFocused();
});

test('showPopover() should focus the autofocus element', async ({ page }) => {
  const popover = page.locator('#singleActionShowPopover');
  await showPopover(popover);
  await expect(popover).toBeVisible();
  await expect(popover.locator('a[autofocus]')).toBeFocused();
});

test('showPopover() should not focus the first focusable element when there is no autofocus element', async ({
  page,
}) => {
  const popover = page.locator('#menuPopover');
  await showPopover(popover);
  await expect(popover).toBeVisible();
  await expect(popover.locator('button').first()).not.toBeFocused();
  expect(await activeElementTag(page)).toBe('BODY');
});

test('clicking button[popovertarget="autofocusPopover"] should focus the popover itself', async ({
  page,
}) => {
  const button = page.locator('button[popovertarget="autofocusPopover"]');
  const popover = page.locator('#autofocusPopover');
  await button.click();
  await expect(popover).toBeVisible();
  await expect(popover).toBeFocused();
});

test('showPopover() on a popover with autofocus should focus the popover itself', async ({
  page,
}) => {
  const popover = page.locator('#autofocusPopover');
  await showPopover(popover);
  await expect(popover).toBeVisible();
  await expect(popover).toBeFocused();
});

test('clicking button[popovertarget="dialogPopover"] should focus the dialog popover itself', async ({
  page,
  browserName,
}) => {
  // `#dialogPopover` has no focusable descendants, so the dialog focusing
  // steps fall back to calling `focus()` on the dialog itself. The Firefox
  // version bundled with Playwright 1.33 (Firefox 112) does not treat a
  // `<dialog>` without a `tabindex` as focusable, so that call is a no-op.
  test.skip(
    browserName === 'firefox',
    'Firefox 112 cannot focus a <dialog> without a tabindex',
  );
  const button = page.locator('button[popovertarget="dialogPopover"]');
  const popover = page.locator('#dialogPopover');
  await button.click();
  await expect(popover).toBeVisible();
  await expect(popover).toBeFocused();
});

test.describe('shadow', () => {
  test('clicking button[popovertarget="shadowNestedPopover"] should open the popover without moving focus', async ({
    page,
  }) => {
    const button = page.locator('button[popovertarget="shadowNestedPopover"]');
    const popover = page.locator('#shadowNestedPopover');
    await button.click();
    await expect(popover).toBeVisible();
    await expect(button).toBeFocused();
  });

  test('showPopover() on a delegatesFocus host should not focus the first focusable element when there is no autofocus element', async ({
    page,
  }) => {
    const popover = await createShadowHostPopover(page, {
      delegatesFocus: true,
      shadowHTML: '<button id="first">First</button><button>Second</button>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#first')).not.toBeFocused();
    expect(await activeElementTag(page)).toBe('BODY');
  });

  test('showPopover() on a delegatesFocus host should not focus the autofocus element in the shadow root', async ({
    page,
  }) => {
    const popover = await createShadowHostPopover(page, {
      delegatesFocus: true,
      shadowHTML:
        '<button>First</button><button id="shadowAutofocus" autofocus>Second</button>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#shadowAutofocus')).not.toBeFocused();
    expect(await activeElementTag(page)).toBe('BODY');
  });

  test('showPopover() on a host without delegatesFocus should not focus the autofocus element in the shadow root', async ({
    page,
  }) => {
    const popover = await createShadowHostPopover(page, {
      delegatesFocus: false,
      shadowHTML: '<button id="shadowAutofocus" autofocus>Autofocus</button>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#shadowAutofocus')).not.toBeFocused();
    expect(await activeElementTag(page)).toBe('BODY');
  });

  test('showPopover() on a delegatesFocus host should focus a slotted autofocus element', async ({
    page,
  }) => {
    const popover = await createShadowHostPopover(page, {
      delegatesFocus: true,
      shadowHTML: '<button>Shadow button</button><slot></slot>',
      lightHTML: '<button id="slottedAutofocus" autofocus>Slotted</button>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#slottedAutofocus')).toBeFocused();
  });

  test('showPopover() on a host without delegatesFocus should focus the popover itself when it has autofocus', async ({
    page,
  }) => {
    const popover = await createShadowHostPopover(page, {
      delegatesFocus: false,
      shadowHTML: '<button>Shadow</button>',
      hostAutofocus: true,
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover).toBeFocused();
  });
});

test.describe('dialog', () => {
  test('showPopover() should focus an autofocus descendant before the first focusable element', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      tag: 'dialog',
      innerHTML:
        '<button>Cancel</button><input id="dialogAutofocus" autofocus>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#dialogAutofocus')).toBeFocused();
  });

  test('showPopover() should focus the first focusable descendant when there is no autofocus element', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      tag: 'dialog',
      innerHTML:
        '<p>Text</p><button id="dialogFirst">First</button><button>Second</button>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#dialogFirst')).toBeFocused();
  });

  test('showPopover() should focus the dialog if there is no focusable descendant', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      tag: 'dialog',
      innerHTML: 'Test',
      tabIndex: 0,
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover).toBeFocused();
  });
});

test.describe('disabled', () => {
  test('showPopover() should not focus a disabled autofocus button', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      innerHTML:
        '<button id="disabledAutofocus" disabled autofocus>Disabled</button>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#disabledAutofocus')).not.toBeFocused();
    expect(await activeElementTag(page)).toBe('BODY');
  });

  test('showPopover() should skip a disabled autofocus button and focus the next autofocus element', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      innerHTML:
        '<button disabled autofocus>Disabled</button><input id="enabledAutofocus" autofocus>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#enabledAutofocus')).toBeFocused();
  });

  test('showPopover() should not focus an autofocus button inside a disabled fieldset', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      innerHTML:
        '<fieldset disabled><button id="fieldsetAutofocus" autofocus>In fieldset</button></fieldset><input id="enabledAutofocus" autofocus>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#fieldsetAutofocus')).not.toBeFocused();
    await expect(popover.locator('#enabledAutofocus')).toBeFocused();
  });

  test.describe('dialog', () => {
    test('showPopover() should skip a disabled autofocus button and focus the next autofocus element', async ({
      page,
    }) => {
      const popover = await createPopover(page, {
        tag: 'dialog',
        innerHTML:
          '<button id="dialogFirst">First</button><button disabled autofocus>Disabled</button><input id="enabledAutofocus" autofocus>',
      });
      await showPopover(popover);
      await expect(popover).toBeVisible();
      await expect(popover.locator('#enabledAutofocus')).toBeFocused();
    });

    test('showPopover() should fall back to the first enabled focusable element when the only autofocus button is disabled', async ({
      page,
    }) => {
      const popover = await createPopover(page, {
        tag: 'dialog',
        innerHTML:
          '<button disabled autofocus>Disabled</button><button disabled>Also disabled</button><button id="dialogFirstEnabled">Enabled</button>',
      });
      await showPopover(popover);
      await expect(popover).toBeVisible();
      await expect(popover.locator('#dialogFirstEnabled')).toBeFocused();
    });
  });
});

test.describe('tabindex', () => {
  test('showPopover() should focus an autofocus element with tabindex="-1"', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      innerHTML:
        '<div id="negativeTabindexAutofocus" tabindex="-1" autofocus>Focusable by script</div>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#negativeTabindexAutofocus')).toBeFocused();
  });

  test('showPopover() should skip a non-focusable autofocus element and focus the next autofocus element', async ({
    page,
  }) => {
    const popover = await createPopover(page, {
      innerHTML:
        '<div autofocus>Not focusable</div><input id="enabledAutofocus" autofocus>',
    });
    await showPopover(popover);
    await expect(popover).toBeVisible();
    await expect(popover.locator('#enabledAutofocus')).toBeFocused();
  });

  test.describe('dialog', () => {
    test('showPopover() should skip tabindex="-1" elements when falling back to the first focusable element', async ({
      page,
    }) => {
      const popover = await createPopover(page, {
        tag: 'dialog',
        innerHTML:
          '<button tabindex="-1">Not sequentially focusable</button><button id="dialogSequential">Sequential</button>',
      });
      await showPopover(popover);
      await expect(popover).toBeVisible();
      await expect(popover.locator('#dialogSequential')).toBeFocused();
    });
  });
});
