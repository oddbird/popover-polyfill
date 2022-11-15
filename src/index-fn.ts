declare global {
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    showPopover(): void;
    hidePopover(): void;
  }
}

export { apply, isSupported } from './popover.js';
