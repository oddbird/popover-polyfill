import { apply, isSupported } from './popover.js';

declare global {
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    defaultOpen: boolean;
    showPopover(): void;
    hidePopover(): void;
  }
}

if (!isSupported()) apply();
