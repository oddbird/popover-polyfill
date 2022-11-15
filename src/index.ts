import { apply, isSupported } from './popover.js';

declare global {
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    showPopover(): void;
    hidePopover(): void;
  }
}

if (!isSupported()) apply();
