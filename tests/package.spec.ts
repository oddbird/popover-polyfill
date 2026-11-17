import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);

const FN_EXPORTS = [
  'apply',
  'injectStyles',
  'isHintSupported',
  'isPolyfilled',
  'isSupported',
];

test('`require("@oddbird/popover-polyfill")` loads the CommonJS build', () => {
  expect(require.resolve('@oddbird/popover-polyfill')).toMatch(
    /dist\/popover\.cjs$/,
  );
  expect(() => require('@oddbird/popover-polyfill')).not.toThrow();
});

test('`require("@oddbird/popover-polyfill/fn")` loads the CommonJS build', () => {
  expect(require.resolve('@oddbird/popover-polyfill/fn')).toMatch(
    /dist\/popover-fn\.cjs$/,
  );
  const fn = require('@oddbird/popover-polyfill/fn');
  for (const name of FN_EXPORTS) {
    expect(typeof fn[name]).toBe('function');
  }
});

test('`import("@oddbird/popover-polyfill/fn")` loads the ESM build', async () => {
  const fn = await import('@oddbird/popover-polyfill/fn');
  for (const name of FN_EXPORTS) {
    expect(typeof fn[name as keyof typeof fn]).toBe('function');
  }
});
