const closestElement: (selector: string, target: Element) => Element | null = (
  selector: string,
  target: Element,
) => {
  const found = target.closest(selector);

  if (found) {
    return found;
  }

  const root = target.getRootNode();

  if (root === document || !(root instanceof ShadowRoot)) {
    return null;
  }

  return closestElement(selector, root.host);
};

export const getPopoversAncestors = (
  element: Element,
  popovers: Element[] = [],
): Element[] => {
  // there could be multiple popovers nested inside each other
  const popoverAncestor = closestElement('[popover]', element);
  const parent =
    popoverAncestor?.parentElement ||
    (popoverAncestor?.getRootNode() as ShadowRoot)?.host;
  return popoverAncestor && parent
    ? getPopoversAncestors(parent, [popoverAncestor, ...popovers])
    : popovers;
};

export const SupportingPopoverTargetAttributesSelector =
  ':is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"])';

const isSupportingPopoverTargetAttributes = (
  element: Element,
): element is HTMLButtonElement | HTMLInputElement => {
  return element.matches(SupportingPopoverTargetAttributesSelector);
};

export const getPopoverTargetElementFromIdref = (
  element: Element,
  attribute: 'popovertoggletarget' | 'popovershowtarget' | 'popoverhidetarget',
): HTMLElement | null => {
  const idref = element.getAttribute(attribute);
  if (idref === null) {
    // If idref is null, then return null.
    return null;
  }
  const root = element.getRootNode();
  if (!(root instanceof ShadowRoot || root instanceof Document)) {
    return null;
  }
  // Let popoverElement be the first element in tree order, within node's root's descendants, whose ID is idref; otherwise, if there is no such element, null.
  const popoverElement = root.getElementById(idref);
  if (popoverElement === null) {
    // If popoverElement is null, then return null.
    return null;
  }
  if (popoverElement.getAttribute('popover') === null) {
    // If popoverElement's popover attribute is in the no popover state, then return null.
    return null;
  }
  // Return popoverElement.
  return popoverElement;
};

export const checkInvokerValidity = (element: Element) => {
  // To get the popover target element given a Node node, perform the following steps. They return an HTML element or null.
  // If node is not supported, then return null.
  if (!isSupportingPopoverTargetAttributes(element)) {
    return false;
  }
  // If node is disabled, then return null.
  if (element.disabled) {
    return false;
  }
  // If node has a form owner and node is a submit button, then return null.
  if (element.form && element.type === 'submit') {
    return false;
  }
  return true;
};
