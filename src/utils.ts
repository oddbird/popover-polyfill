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

export const getContainingPopovers = (target: Element) => {
  const popovers: HTMLElement[] = [];
  let currentPopover = closestElement(
    '[popover]',
    target,
  ) as HTMLElement | null;
  while (currentPopover) {
    popovers.push(currentPopover);
    currentPopover = closestElement(
      '[popover]',
      currentPopover,
    ) as HTMLElement | null;
  }
  return popovers;
};

const isSupportingPopoverTargetAttributes = (
  element: Element,
): element is HTMLButtonElement | HTMLInputElement => {
  return element.matches(
    ':is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"])',
  );
};

export const getPopoverTargetElement: (
  target: Element,
) => HTMLElement | null = (element: Element) => {
  // To get the popover target element given a Node node, perform the following steps. They return an HTML element or null.
  if (
    // If node is not supported, then return null.
    !isSupportingPopoverTargetAttributes(element) ||
    // If node is disabled, then return null.
    element.disabled ||
    // If node has a form owner and node is a submit button, then return null.
    (element.form && element.type === 'submit')
  ) {
    return null;
  }
  // Let idref be null.
  let idref: string | null = null;
  if (element.hasAttribute('popovertoggletarget')) {
    // If node has a popovertoggletarget attribute, then set idref to the value of node's popovertoggletarget attribute.
    idref = element.getAttribute('popovertoggletarget');
  } else if (element.hasAttribute('popovershowtarget')) {
    // Otherwise, if node has a popovershowtarget attribute, then set idref to the value of node's popovershowtarget attribute.
    idref = element.getAttribute('popovershowtarget');
  } else if (element.hasAttribute('popoverhidetarget')) {
    // Otherwise, if node has a popoverhidetarget attribute, then set idref to the value of node's popoverhidetarget attribute.
    idref = element.getAttribute('popoverhidetarget');
  }
  if (idref === null) {
    // If idref is null, then return null.
    return null;
  }
  // Let popoverElement be the first element in tree order, within node's root's descendants, whose ID is idref; otherwise, if there is no such element, null.
  const popoverElement = element.getRootNode().getElementById(idref);
  if (popoverElement === null) {
    // If popoverElement is null, then return null.
    return null;
  }
  if (popoverElement.getAttribute('popover') === 'no') {
    // If popoverElement's popover attribute is in the no popover state, then return null.
    return null;
  }
  // Return popoverElement.
  return popoverElement;
  // If node has a popovertoggletarget attribute, then set idref to the value of node's popovertoggletarget attribute.
  // Otherwise, if node has a popovershowtarget attribute, then set idref to the value of node's popovershowtarget attribute.
  // Otherwise, if node has a popoverhidetarget attribute, then set idref to the value of node's popoverhidetarget attribute.
  // If idref is null, then return null.
  // Let popoverElement be the first element in tree order, within node's root's descendants, whose ID is idref; otherwise, if there is no such element, null.
  // If popoverElement is null, then return null.
  // If popoverElement's popover attribute is in the no popover state, then return null.
  // Return popoverElement.
};
