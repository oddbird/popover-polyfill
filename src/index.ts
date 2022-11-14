import { apply, isSupported } from './popover.js';

if (!isSupported()) apply();

declare global {
  interface HTMLElement {
    popover: 'auto' | 'hint' | 'manual';
    defaultOpen: boolean;
    showPopover(): void;
    hidePopover(): void;
  }
}
