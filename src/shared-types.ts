/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/togglePopover) */
export interface PopoverTogglePopoverOptions {
  force?: boolean;
  source?: HTMLElement;
}

/** [MDN Reference](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/showPopover) */
export interface PopoverShowPopoverOptions {
  source?: HTMLElement;
}

export interface PopoverToggleTargetElementInvoker {
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetAction) */
  popoverTargetAction: string;
  /** [MDN Reference](https://developer.mozilla.org/docs/Web/API/HTMLButtonElement/popoverTargetElement) */
  popoverTargetElement: Element | null;
}
