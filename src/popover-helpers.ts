import {
  invokers,
  openPopoverSelector,
  popoverInvokerSelector,
  popovers,
} from './data.js';
export const initialAriaExpandedValue = new WeakMap<
  HTMLButtonElement | HTMLInputElement,
  null | string
>();

export function* getInvokersFor(el: HTMLElement) {
  if (!popovers.has(el)) return;
  for (const invoker of invokers) {
    if (getPopoverFor(invoker) === el) yield invoker;
  }
}

export function getPopoverFor(el: HTMLButtonElement | HTMLInputElement) {
  return (
    el.popoverToggleTargetElement ||
    el.popoverShowTargetElement ||
    el.popoverHideTargetElement
  );
}

export function* getOpenAutoPopovers() {
  for (const popover of popovers) {
    if (popover.matches(openPopoverSelector)) {
      yield popover;
    }
  }
}

export function hideOpenAutoPopovers(except?: Element) {
  for (const popover of getOpenAutoPopovers()) {
    if (popover !== except) popover.hidePopover();
  }
}

export function closestShadowPenetrating(
  selector: string,
  target: Element,
): Element | undefined {
  const found = target.closest(selector);
  if (found) {
    return found;
  }

  const root = target.getRootNode();
  if (root === document || !(root instanceof ShadowRoot)) {
    return;
  }

  return closestShadowPenetrating(selector, root.host);
}

export function setInvokerAriaExpanded(
  el: HTMLButtonElement | HTMLInputElement,
) {
  if (!initialAriaExpandedValue.has(el)) {
    initialAriaExpandedValue.set(el, el.getAttribute('aria-expanded'));
  }
  const popover = getPopoverFor(el);
  if (popover) {
    invokers.add(el);
  } else {
    invokers.delete(el);
  }
  if (popover && popover.popover === 'auto') {
    el.setAttribute(
      'aria-expanded',
      String(popover.classList.contains(':open')),
    );
  } else {
    const initialValue = initialAriaExpandedValue.get(el);
    if (!initialValue) {
      el.removeAttribute('aria-expanded');
    } else {
      el.setAttribute('aria-expanded', initialValue);
    }
  }
}

export function* getPopoversFromNode(node: Node) {
  if (node instanceof HTMLElement && node.hasAttribute('popover')) {
    yield node;
  }
  if (
    node instanceof Document ||
    node instanceof ShadowRoot ||
    node instanceof HTMLElement
  ) {
    for (const el of node.querySelectorAll('[popover]')) {
      if (el instanceof HTMLElement) {
        yield el;
      }
    }
  }
}

export function* getInvokersFromNode(
  node: Node,
): Generator<HTMLButtonElement | HTMLInputElement> {
  if (
    (node instanceof HTMLInputElement || node instanceof HTMLButtonElement) &&
    node.matches(popoverInvokerSelector)
  ) {
    yield node;
  }
  if (
    node instanceof Document ||
    node instanceof ShadowRoot ||
    node instanceof HTMLElement
  ) {
    for (const el of node.querySelectorAll(popoverInvokerSelector)) {
      if (el instanceof HTMLInputElement || el instanceof HTMLButtonElement) {
        yield el;
      }
    }
  }
}
