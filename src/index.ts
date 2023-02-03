import { apply, isSupported } from './popover.js';

interface PopoverToggleTargetElementInvoker {
  popoverToggleTargetElement: HTMLElement | null;
  popoverShowTargetElement: HTMLElement | null;
  popoverHideTargetElement: HTMLElement | null;
}

declare global {
  interface BeforeToggleEvent extends Event {
    currentState: string;
    newState: string;
  }
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    showPopover(): void;
    hidePopover(): void;
  }
  /* eslint-disable @typescript-eslint/no-empty-interface */
  interface HTMLButtonElement extends PopoverToggleTargetElementInvoker {}
  interface HTMLInputElement extends PopoverToggleTargetElementInvoker {}
  /* eslint-enable @typescript-eslint/no-empty-interface */
  interface Window {
    BeforeToggleEvent: BeforeToggleEvent;
  }
}

if (!isSupported()) apply();
