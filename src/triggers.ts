const closestAncestor: (selector: string, target: Element) => Element | null = (
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

  return closestAncestor(selector, root.host);
};

export const queryAncestorAll = (
  element: Element,
  selector: string,
  popovers: Element[] = [],
): Element[] => {
  // there could be multiple popovers nested inside each other
  const ancestor = closestAncestor(selector, element);
  const parent =
    ancestor?.parentElement || (ancestor?.getRootNode() as ShadowRoot)?.host;
  return ancestor && parent
    ? queryAncestorAll(parent, selector, [ancestor, ...popovers])
    : popovers;
};

export const getPopoversAncestors = (
  element: Element,
  popovers: Element[] = [],
): Element[] => {
  // there could be multiple popovers nested inside each other
  const popoverAncestor = closestAncestor('[popover]', element);
  const parent =
    popoverAncestor?.parentElement ||
    (popoverAncestor?.getRootNode() as ShadowRoot)?.host;
  return popoverAncestor && parent
    ? getPopoversAncestors(parent, [popoverAncestor, ...popovers])
    : popovers;
};
