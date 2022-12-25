export const popovers = new Set<HTMLElement>();

const handleChildListMutation = (mutation: MutationRecord) => {
  if (mutation.addedNodes.length > 0) {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.hasAttribute('popover')) {
          popovers.add(node);
        }
      }
    });
  }

  mutation.removedNodes.forEach((node) => {
    if (node instanceof HTMLElement && node.hasAttribute('popover')) {
      popovers.delete(node);
    }
  });
};

const handlePopoverAttributeMutation = (mutation: MutationRecord) => {
  if (mutation.target instanceof HTMLElement) {
    if (mutation.target.hasAttribute('popover')) {
      popovers.add(mutation.target);
    } else {
      popovers.delete(mutation.target);
    }
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
        }
        break;
      case 'childList':
        handleChildListMutation(mutation);
        break;
    }
  });
};

const observer = new MutationObserver(handleMutation);

export const observeDocumentOrShadowRootMutations = (
  documentOrShadowRoot: Document | ShadowRoot,
) => {
  // Document don't initially trigger childList mutations as
  // opposed to ShadowRoots so we need to manually add the popovers
  if (documentOrShadowRoot instanceof Document) {
    documentOrShadowRoot.querySelectorAll('[popover]').forEach((popover) => {
      if (popover instanceof HTMLElement) {
        popovers.add(popover);
      }
    });
  }

  observer.observe(documentOrShadowRoot, {
    attributeFilter: ['popover'],
    childList: true,
    subtree: true,
  });
};
