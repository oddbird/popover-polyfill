import { apply, isSupported } from './popover.js';

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
  interface HTMLButtonElement {
    popoverToggleTargetElement: HTMLElement | null;
    popoverShowTargetElement: HTMLElement | null;
    popoverHideTargetElement: HTMLElement | null;
  }
  interface HTMLInputElement {
    popoverToggleTargetElement: HTMLElement | null;
    popoverShowTargetElement: HTMLElement | null;
    popoverHideTargetElement: HTMLElement | null;
  }
  interface Window {
    BeforeToggleEvent: BeforeToggleEvent;
  }
}

if (!isSupported()) apply();
