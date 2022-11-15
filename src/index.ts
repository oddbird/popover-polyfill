import { apply, isSupported } from './popover.js';

if (!isSupported()) apply();

declare global {
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    defaultOpen: boolean;
    showPopover(): void;
    hidePopover(): void;
  }
}
