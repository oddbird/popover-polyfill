declare global {
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    defaultOpen: boolean;
    showPopover(): void;
    hidePopover(): void;
  }
}

export { apply, isSupported } from './popover.js';
