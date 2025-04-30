import { apply, isSupported } from './popover.js';
import {
  PopoverShowPopoverOptions,
  PopoverTogglePopoverOptions,
} from './types.js';

interface PopoverToggleTargetElementInvoker {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetAction) */
  popoverTargetAction: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetElement) */
  popoverTargetElement: Element | null;
}

declare global {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ToggleEvent) */
  interface ToggleEvent extends Event {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ToggleEvent/newState) */
    readonly newState: string;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/ToggleEvent/oldState) */
    readonly oldState: string;
  }

  interface HTMLElement {
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/popover) */
    popover: string | null;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/hidePopover) */
    hidePopover(): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/showPopover) */
    showPopover(options?: PopoverShowPopoverOptions): void;
    /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLElement/togglePopover) */
    togglePopover(force?: boolean): void;
    togglePopover(options?: PopoverTogglePopoverOptions): void;
  }

  /* eslint-disable @typescript-eslint/no-empty-object-type */
  interface HTMLButtonElement extends PopoverToggleTargetElementInvoker {}
  interface HTMLInputElement extends PopoverToggleTargetElementInvoker {}
  /* eslint-enable @typescript-eslint/no-empty-object-type */

  interface Window {
    ToggleEvent: ToggleEvent;
  }
}

if (!isSupported()) apply();
