import { apply, isSupported } from './popover.js';

declare global {
  interface BeforeToggleEvent extends Event {
    currentState: string;
    newState: string;
  }
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    popoverToggleTargetElement: HTMLElement | null;
    popoverShowTargetElement: HTMLElement | null;
    popoverHideTargetElement: HTMLElement | null;
    showPopover(): void;
    hidePopover(): void;
  }
  interface Window {
    BeforeToggleEvent: BeforeToggleEvent;
  }
}

if (!isSupported()) apply();
