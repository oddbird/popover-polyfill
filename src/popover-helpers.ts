import { queuePopoverToggleEventTask, ToggleEvent } from './events.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ShadowRoot = globalThis.ShadowRoot || function () {};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const HTMLDialogElement = globalThis.HTMLDialogElement || function () {};

const topLayerElements = new WeakMap<Document, Set<HTMLElement>>();
const autoPopoverList = new WeakMap<Document, Set<HTMLElement>>();
const hintPopoverList = new WeakMap<Document, Set<HTMLElement>>();
export const visibilityState = new WeakMap<HTMLElement, 'hidden' | 'showing'>();
const openInPopoverMode = new WeakMap<HTMLElement, 'auto' | 'hint'>();
function getPopoverVisibilityState(popover: HTMLElement): 'hidden' | 'showing' {
  return visibilityState.get(popover) || 'hidden';
}

const popoverInvoker = new WeakMap<
  HTMLElement,
  HTMLButtonElement | HTMLInputElement
>();

const combinedPopoverListForDocument = (
  document: Document,
): Set<HTMLElement> => {
  const autoPopovers = autoPopoverList.get(document) || new Set();
  const hintPopovers = hintPopoverList.get(document) || new Set();
  return new Set([...autoPopovers, ...hintPopovers]);
};

// https://html.spec.whatwg.org/#popover-target-attribute-activation-behavior
export function popoverTargetAttributeActivationBehavior(
  element: HTMLButtonElement | HTMLInputElement,
) {
  const popover = element.popoverTargetElement;
  if (!(popover instanceof HTMLElement)) {
    return;
  }
  const visibility = getPopoverVisibilityState(popover);
  if (element.popoverTargetAction === 'show' && visibility === 'showing') {
    return;
  }
  if (element.popoverTargetAction === 'hide' && visibility === 'hidden') return;
  if (visibility === 'showing') {
    hidePopover(popover, true, true);
  } else if (checkPopoverValidity(popover, false)) {
    popoverInvoker.set(popover, element);
    showPopover(popover);
  }
}

// https://html.spec.whatwg.org/#check-popover-validity
function checkPopoverValidity(
  element: HTMLElement,
  expectedToBeShowing: boolean,
) {
  if (
    element.popover !== 'auto' &&
    element.popover !== 'manual' &&
    element.popover !== 'hint'
  ) {
    return false;
  }
  if (!element.isConnected) return false;
  if (expectedToBeShowing && getPopoverVisibilityState(element) !== 'showing') {
    return false;
  }
  if (!expectedToBeShowing && getPopoverVisibilityState(element) !== 'hidden') {
    return false;
  }
  if (element instanceof HTMLDialogElement && element.hasAttribute('open')) {
    return false;
  }
  if (document.fullscreenElement === element) return false;
  return true;
}

function getStackPosition(popover?: Element) {
  if (!popover) return 0;
  // A hint popover's stack position is the index in the hint popover list plus
  // the autoPopover list length
  const combinedPopoverList = [
    ...combinedPopoverListForDocument(popover.ownerDocument),
  ];
  return combinedPopoverList.indexOf(popover as HTMLElement) + 1;
}

function topMostClickedPopover(target: HTMLElement) {
  const clickedPopover = nearestInclusiveOpenPopover(target);
  const invokerPopover = nearestInclusiveTargetPopoverForInvoker(target);
  if (getStackPosition(clickedPopover) > getStackPosition(invokerPopover)) {
    return clickedPopover;
  }
  return invokerPopover;
}

// https://html.spec.whatwg.org/#topmost-auto-popover
function topMostAutoOrHintPopover(document: Document): HTMLElement | null {
  const documentPopovers = combinedPopoverListForDocument(document);
  for (const popover of documentPopovers || []) {
    if (!popover.isConnected) {
      // TODO: [hint] Do we need to remove from the right list here?
      documentPopovers!.delete(popover);
    } else {
      return popover;
    }
  }
  return null;
}

function topMostPopoverInList(list: Set<HTMLElement>): HTMLElement | null {
  for (const popover of list || []) {
    if (!popover.isConnected) {
      list!.delete(popover);
    } else {
      return popover;
    }
  }
  return null;
}

export function getRootNode(node: Node): Node {
  if (typeof node.getRootNode === 'function') {
    return node.getRootNode();
  }
  if (node.parentNode) return getRootNode(node.parentNode);
  return node;
}

// https://html.spec.whatwg.org/#nearest-inclusive-open-popover
function nearestInclusiveOpenPopover(
  node: Node | null,
): HTMLElement | undefined {
  while (node) {
    if (
      node instanceof HTMLElement &&
      node.popover === 'auto' &&
      visibilityState.get(node) === 'showing'
    ) {
      return node;
    }
    node =
      (node instanceof Element && node.assignedSlot) ||
      node.parentElement ||
      getRootNode(node);
    if (node instanceof ShadowRoot) node = node.host;
    if (node instanceof Document) return;
  }
}

// https://html.spec.whatwg.org/#popover-light-dismiss:nearest-inclusive-target-popover-for-invoker
function nearestInclusiveTargetPopoverForInvoker(
  node: Node | null,
): HTMLElement | undefined {
  while (node) {
    const nodePopover = (node as HTMLButtonElement).popoverTargetElement;
    if (nodePopover instanceof HTMLElement) return nodePopover;
    node = node.parentElement || getRootNode(node);
    if (node instanceof ShadowRoot) node = node.host;
    if (node instanceof Document) return;
  }
}

// https://html.spec.whatwg.org/#topmost-popover-ancestor
function topMostPopoverAncestor(
  newPopover: HTMLElement,
  list: Set<HTMLElement>,
): HTMLElement | null {
  const popoverPositions = new Map();
  let i = 0;
  for (const popover of list || []) {
    popoverPositions.set(popover, i);
    i += 1;
  }
  popoverPositions.set(newPopover, i);
  i += 1;
  let topMostPopoverAncestor: HTMLElement | null = null;
  function checkAncestor(candidate: Node | null) {
    const candidateAncestor = nearestInclusiveOpenPopover(candidate);
    if (candidateAncestor === null) return null;
    const candidatePosition = popoverPositions.get(candidateAncestor);
    if (
      topMostPopoverAncestor === null ||
      popoverPositions.get(topMostPopoverAncestor) < candidatePosition
    ) {
      topMostPopoverAncestor = candidateAncestor!;
    }
  }
  checkAncestor(newPopover.parentElement || getRootNode(newPopover));
  return topMostPopoverAncestor;
}

function isFocusable(focusTarget: HTMLElement) {
  if (focusTarget.hidden || focusTarget instanceof ShadowRoot) return false;
  if (
    focusTarget instanceof HTMLButtonElement ||
    focusTarget instanceof HTMLInputElement ||
    focusTarget instanceof HTMLSelectElement ||
    focusTarget instanceof HTMLTextAreaElement ||
    focusTarget instanceof HTMLOptGroupElement ||
    focusTarget instanceof HTMLOptionElement ||
    focusTarget instanceof HTMLFieldSetElement
  ) {
    if (focusTarget.disabled) return false;
  }
  if (
    focusTarget instanceof HTMLInputElement &&
    focusTarget.type === 'hidden'
  ) {
    return false;
  }
  if (focusTarget instanceof HTMLAnchorElement && focusTarget.href === '') {
    return false;
  }
  return (
    typeof focusTarget.tabIndex === 'number' && focusTarget.tabIndex !== -1
  );
}

// This method is not spec compliant, as it also looks in slotted content
// for autofocus elements.
// See: https://github.com/oddbird/popover-polyfill/issues/149
// Spec: https://html.spec.whatwg.org/#focus-delegate
function focusDelegate(focusTarget: HTMLElement) {
  if (
    focusTarget.shadowRoot &&
    focusTarget.shadowRoot.delegatesFocus !== true
  ) {
    return null;
  }
  let whereToLook: DocumentFragment | HTMLElement = focusTarget;
  if (whereToLook.shadowRoot) {
    whereToLook = whereToLook.shadowRoot;
  }
  let autoFocusDelegate = whereToLook.querySelector('[autofocus]');
  if (autoFocusDelegate) {
    return autoFocusDelegate;
  } else {
    const slots = whereToLook.querySelectorAll('slot');
    for (const slot of slots) {
      const assignedElements = slot.assignedElements({ flatten: true });
      for (const el of assignedElements) {
        if (el.hasAttribute('autofocus')) {
          return el;
        } else {
          autoFocusDelegate = el.querySelector('[autofocus]');
          if (autoFocusDelegate) {
            return autoFocusDelegate;
          }
        }
      }
    }
  }
  const walker = focusTarget.ownerDocument.createTreeWalker(
    whereToLook,
    NodeFilter.SHOW_ELEMENT,
  );
  let descendant: Node | null = walker.currentNode;
  while (descendant) {
    // this is not spec compliant
    if (isFocusable(descendant as HTMLElement)) {
      return descendant;
    }
    descendant = walker.nextNode();
  }
}

// https://html.spec.whatwg.org/#popover-focusing-steps
function popoverFocusingSteps(subject: HTMLElement) {
  (focusDelegate(subject) as HTMLElement)?.focus();
}

const previouslyFocusedElements = new WeakMap<HTMLElement, HTMLElement>();

// https://html.spec.whatwg.org/#show-popover
export function showPopover(element: HTMLElement) {
  if (!checkPopoverValidity(element, false)) {
    return;
  }
  const document = element.ownerDocument;
  if (
    !element.dispatchEvent(
      new ToggleEvent('beforetoggle', {
        cancelable: true,
        oldState: 'closed',
        newState: 'open',
      }),
    )
  ) {
    return;
  }
  if (!checkPopoverValidity(element, false)) {
    return;
  }
  let shouldRestoreFocus = false;
  const originalType = element.getAttribute('popover');
  let stackToAppendTo = originalType;
  const autoAncestor = topMostPopoverAncestor(
    element,
    autoPopoverList.get(document) || new Set(),
  );
  const hintAncestor = topMostPopoverAncestor(
    element,
    hintPopoverList.get(document) || new Set(),
  );
  if (originalType === 'auto') {
    // Close all hint popovers
    closeAllOpenPopoversInList(
      hintPopoverList.get(document) || new Set(),
      false,
      true,
    );
    const ancestor = autoAncestor || document;
    hideAllPopoversUntil(ancestor, shouldRestoreFocus, true);
  }
  if (originalType === 'hint') {
    if (hintAncestor) {
      hideAllPopoversUntil(hintAncestor, shouldRestoreFocus, true);
    } else {
      // Close all hint popovers
      closeAllOpenPopoversInList(
        hintPopoverList.get(document) || new Set(),
        false,
        true,
      );
      if (autoAncestor) {
        hideAllPopoversUntil(autoAncestor, shouldRestoreFocus, true);
        stackToAppendTo = 'auto';
      }
    }
  }
  if (
    originalType !== element.getAttribute('popover') ||
    !checkPopoverValidity(element, false)
  ) {
    return;
  }

  if (!topMostAutoOrHintPopover(document)) {
    shouldRestoreFocus = true;
  }

  if (
    stackToAppendTo === 'auto' &&
    !autoPopoverList.get(document)?.has(element)
  ) {
    openInPopoverMode.set(element, 'auto');
  } else if (
    stackToAppendTo === 'hint' &&
    !hintPopoverList.get(document)?.has(element)
  ) {
    openInPopoverMode.set(element, 'hint');
  }

  previouslyFocusedElements.delete(element);
  const originallyFocusedElement = document.activeElement as HTMLElement;
  element.classList.add(':popover-open');
  visibilityState.set(element, 'showing');
  if (!topLayerElements.has(document)) {
    topLayerElements.set(document, new Set());
  }
  topLayerElements.get(document)!.add(element);
  popoverFocusingSteps(element);
  if (element.popover === 'auto') {
    if (!autoPopoverList.has(document)) {
      autoPopoverList.set(document, new Set());
    }
    autoPopoverList.get(document)!.add(element);
    setInvokerAriaExpanded(popoverInvoker.get(element), true);
  } else if (element.popover === 'hint') {
    if (!hintPopoverList.has(document)) {
      hintPopoverList.set(document, new Set());
    }
    hintPopoverList.get(document)!.add(element);
    setInvokerAriaExpanded(popoverInvoker.get(element), true);
  }
  if (
    shouldRestoreFocus &&
    originallyFocusedElement &&
    element.popover === 'auto'
  ) {
    previouslyFocusedElements.set(element, originallyFocusedElement);
  }
  queuePopoverToggleEventTask(element, 'closed', 'open');
}

// https://html.spec.whatwg.org/#hide-popover-algorithm
export function hidePopover(
  element: HTMLElement,
  focusPreviousElement = false,
  fireEvents = false,
) {
  if (!checkPopoverValidity(element, true)) {
    return;
  }
  const document = element.ownerDocument;
  if (['auto', 'hint'].includes(element.popover as string)) {
    hideAllPopoversUntil(element, focusPreviousElement, fireEvents);
    if (!checkPopoverValidity(element, true)) {
      return;
    }
  }
  setInvokerAriaExpanded(popoverInvoker.get(element), false);
  popoverInvoker.delete(element);
  if (fireEvents) {
    element.dispatchEvent(
      new ToggleEvent('beforetoggle', {
        oldState: 'open',
        newState: 'closed',
      }),
    );
    if (!checkPopoverValidity(element, true)) {
      return;
    }
  }
  topLayerElements.get(document)?.delete(element);
  if (element.popover === 'auto') {
    autoPopoverList.get(document)?.delete(element);
  } else if (element.popover === 'hint') {
    hintPopoverList.get(document)?.delete(element);
  }
  element.classList.remove(':popover-open');
  visibilityState.set(element, 'hidden');
  if (fireEvents) {
    queuePopoverToggleEventTask(element, 'open', 'closed');
  }
  const previouslyFocusedElement = previouslyFocusedElements.get(element);
  if (previouslyFocusedElement) {
    previouslyFocusedElements.delete(element);
    if (focusPreviousElement) {
      previouslyFocusedElement.focus();
    }
  }
}

function closeAllOpenPopovers(
  document: Document,
  focusPreviousElement = false,
  fireEvents = false,
) {
  let popover = topMostAutoOrHintPopover(document);
  while (popover) {
    hidePopover(popover, focusPreviousElement, fireEvents);
    popover = topMostAutoOrHintPopover(document);
  }
}

function closeAllOpenPopoversInList(
  list: Set<HTMLElement>,
  focusPreviousElement = false,
  fireEvents = false,
) {
  let popover = topMostPopoverInList(list);
  while (popover) {
    hidePopover(popover, focusPreviousElement, fireEvents);
    popover = topMostPopoverInList(list);
  }
}

// https://html.spec.whatwg.org/#hide-all-popovers-until
export function hideAllPopoversUntil(
  endpoint: Element | Document,
  focusPreviousElement: boolean,
  fireEvents: boolean,
) {
  const document = endpoint.ownerDocument || endpoint;
  if (endpoint instanceof Document) {
    return closeAllOpenPopovers(document, focusPreviousElement, fireEvents);
  }
  if (hintPopoverList.get(document)?.has(endpoint as HTMLElement)) {
    // run hide popover stack
    return;
  }
  closeAllOpenPopoversInList(
    hintPopoverList.get(document) || new Set(),
    focusPreviousElement,
    fireEvents,
  );

  let lastToHide = null;
  let foundEndpoint = false;
  for (const popover of autoPopoverList.get(document) || []) {
    if (popover === endpoint) {
      foundEndpoint = true;
    } else if (foundEndpoint) {
      lastToHide = popover;
      break;
    }
  }
  if (!foundEndpoint) {
    return closeAllOpenPopovers(document, focusPreviousElement, fireEvents);
  }
  while (
    lastToHide &&
    getPopoverVisibilityState(lastToHide) === 'showing' &&
    autoPopoverList.get(document)?.size
  ) {
    hidePopover(lastToHide, focusPreviousElement, fireEvents);
  }
}

const popoverPointerDownTargets = new WeakMap<Document, HTMLElement>();
// https://html.spec.whatwg.org/#topmost-clicked-popover
export function lightDismissOpenPopovers(event: Event) {
  if (!event.isTrusted) return;
  // Composed path allows us to find the target within shadowroots
  const target = event.composedPath()[0] as HTMLElement;
  if (!target) return;
  const document = target.ownerDocument;
  const topMostPopover = topMostAutoOrHintPopover(document);
  if (!topMostPopover) return;
  const ancestor = topMostClickedPopover(target);
  if (ancestor && event.type === 'pointerdown') {
    popoverPointerDownTargets.set(document, ancestor);
  } else if (event.type === 'pointerup') {
    const sameTarget = popoverPointerDownTargets.get(document) === ancestor;
    popoverPointerDownTargets.delete(document);
    if (sameTarget) {
      hideAllPopoversUntil(ancestor || document, false, true);
    }
  }
}

const initialAriaExpandedValue = new WeakMap<
  HTMLButtonElement | HTMLInputElement,
  null | string
>();

function setInvokerAriaExpanded(
  el?: HTMLButtonElement | HTMLInputElement,
  force = false,
) {
  if (!el) return;
  if (!initialAriaExpandedValue.has(el)) {
    initialAriaExpandedValue.set(el, el.getAttribute('aria-expanded'));
  }
  const popover = el.popoverTargetElement;
  if (popover instanceof HTMLElement && popover.popover === 'auto') {
    el.setAttribute('aria-expanded', String(force));
  } else {
    const initialValue = initialAriaExpandedValue.get(el);
    if (!initialValue) {
      el.removeAttribute('aria-expanded');
    } else {
      el.setAttribute('aria-expanded', initialValue);
    }
  }
}
