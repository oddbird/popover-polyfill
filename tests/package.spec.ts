import { createRequire } from 'node:module';

import { expect, test } from '@playwright/test';

const require = createRequire(import.meta.url);

test('`require("@oddbird/popover-polyfill/fn")` loads the CommonJS build', () => {
  const fn = require('@oddbird/popover-polyfill/fn');
  expect(typeof fn.apply).toBe('function');
  expect(typeof fn.injectStyles).toBe('function');
  expect(typeof fn.isHintSupported).toBe('function');
  expect(typeof fn.isPolyfilled).toBe('function');
  expect(typeof fn.isSupported).toBe('function');
});
