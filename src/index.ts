import { apply, isSupported } from './popover.js';

declare global {
  interface BeforeToggleEvent extends Event {
    currentState: string;
    newState: string;
  }
  interface HTMLElement {
    popover: 'auto' | 'manual' | null;
    popoverToggleTargetElement: HTMLElement | undefined;
    popoverShowTargetElement: HTMLElement | undefined;
    popoverHideTargetElement: HTMLElement | undefined;
    showPopover(): void;
    hidePopover(): void;
  }
  interface Window {
    BeforeToggleEvent: BeforeToggleEvent;
  }
}

if (!isSupported()) apply();
