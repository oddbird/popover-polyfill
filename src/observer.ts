import { invokers, popoverInvokerAttributes, popovers } from './data.js';
import {
  getInvokersFromNode,
  getPopoversFromNode,
  setInvokerAriaExpanded,
} from './popover-helpers.js';

const handleChildListMutation = (mutation: MutationRecord) => {
  for (const node of mutation.addedNodes) {
    for (const invoker of getInvokersFromNode(node)) {
      setInvokerAriaExpanded(invoker);
    }
    for (const popover of getPopoversFromNode(node)) {
      popovers.add(popover);
    }
  }
  for (const node of mutation.removedNodes) {
    for (const invoker of getInvokersFromNode(node)) {
      invokers.delete(invoker);
    }
    for (const popover of getPopoversFromNode(node)) {
      popovers.delete(popover);
    }
  }
};

const handlePopoverAttributeMutation = (mutation: MutationRecord) => {
  const target = mutation.target;
  if (target instanceof HTMLElement) {
    if (target.hasAttribute('popover')) {
      popovers.add(target);
    } else {
      popovers.delete(target);
    }
  }
};

const handleInvokerAttributeMutation = (mutation: MutationRecord) => {
  const target = mutation.target;
  if (
    target instanceof HTMLButtonElement ||
    target instanceof HTMLInputElement
  ) {
    setInvokerAriaExpanded(target);
  }
};

const handleMutation = (mutationList: MutationRecord[]) => {
  mutationList.forEach((mutation) => {
    switch (mutation.type) {
      case 'attributes':
        switch (mutation.attributeName) {
          case 'popover':
            handlePopoverAttributeMutation(mutation);
            break;
          default:
            handleInvokerAttributeMutation(mutation);
            break;
        }
        break;
      case 'childList':
        handleChildListMutation(mutation);
        break;
    }
  });
};

const observer = new MutationObserver(handleMutation);

export const observePopoversMutations = (root: Document | ShadowRoot) => {
  // Documents don't initially trigger childList mutations as opposed
  // to shadow roots, so we need to manually add the popovers to the set
  if (root === document) {
    for (const popover of getPopoversFromNode(root)) {
      popovers.add(popover);
    }
    for (const invoker of getInvokersFromNode(root)) {
      setInvokerAriaExpanded(invoker);
    }
  }

  observer.observe(root, {
    attributeFilter: ['popover', ...popoverInvokerAttributes],
    childList: true,
    subtree: true,
  });
};
