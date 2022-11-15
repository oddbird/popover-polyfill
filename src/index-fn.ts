declare global {
  interface HTMLElement {
    popover: 'auto' | 'hint' | 'manual';
    defaultOpen: boolean;
    showPopover(): void;
    hidePopover(): void;
  }
}

export { apply, isSupported } from './popover.js';
