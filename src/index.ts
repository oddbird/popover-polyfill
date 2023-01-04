import {
  apply,
  isSupported,
  ORIGINAL_ATTACH_SHADOW_SYMBOL,
} from './popover.js';

declare global {
  interface Element {
    [ORIGINAL_ATTACH_SHADOW_SYMBOL]: (init: ShadowRootInit) => ShadowRoot;
  }

  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    showPopover(): void;
    hidePopover(): void;
  }
}

if (!isSupported()) apply();

// Also works.
class C {
  static readonly StaticSymbol: unique symbol = Symbol();
}
console.log(C);
