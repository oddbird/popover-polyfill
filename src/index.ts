import { apply, isSupported } from './popover.js';

declare global {
  interface BeforeToggleEvent extends Event {
    currentState: string;
    newState: string;
  }
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    popoverToggleTargetElement: string | HTMLElement | null;
    popoverShowTargetElement: string | HTMLElement | null;
    popoverHideTargetElement: string | HTMLElement | null;
    showPopover(): void;
    hidePopover(): void;
  }
  interface Window {
    BeforeToggleEvent: BeforeToggleEvent;
  }
}

if (!isSupported()) apply();
