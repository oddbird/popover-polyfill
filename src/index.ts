import { apply, isSupported } from './popover.js';

interface PopoverToggleTargetElementInvoker {
  popoverTargetElement: HTMLElement | null;
  popoverTargetAction: 'toggle' | 'show' | 'hide';
}

declare global {
  interface ToggleEvent extends Event {
    oldState: string;
    newState: string;
  }
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    showPopover(): void;
    hidePopover(): void;
    togglePopover(): void;
  }
  /* eslint-disable @typescript-eslint/no-empty-interface */
  interface HTMLButtonElement extends PopoverToggleTargetElementInvoker {}
  interface HTMLInputElement extends PopoverToggleTargetElementInvoker {}
  /* eslint-enable @typescript-eslint/no-empty-interface */
  interface Window {
    ToggleEvent: ToggleEvent;
  }
}

if (!isSupported()) apply();
