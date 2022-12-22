import { apply, isSupported } from './popover.js';

declare global {
  interface Element {
    _originalAttachShadow(init: ShadowRootInit): ShadowRoot;
  }

  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    showPopover(): void;
    hidePopover(): void;
  }
}

if (!isSupported()) apply();
