export const popovers = new Set<HTMLElement>();
export const invokers = new Set<HTMLButtonElement | HTMLInputElement>();

export const popoverInvokerSupportedElements = [
  'button',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="image"]',
  'input[type="reset"]',
] as const;

export const popoverInvokerAttributes = [
  'popoverToggleTarget',
  'popoverShowTarget',
  'popoverHideTarget',
] as const;

export const popoverInvokerSelector = popoverInvokerSupportedElements
  .flatMap((s) => {
    return popoverInvokerAttributes.map((a) => `${s}[${a}]`);
  })
  .join(', ');

export const openPopoverSelector =
  '[popover="" i].\\:open, [popover=auto i].\\:open';
