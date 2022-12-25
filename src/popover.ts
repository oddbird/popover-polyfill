const popovers = new Set<HTMLElement>();

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

function patchAttachShadow() {
  Element.prototype._originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadowRoot = this._originalAttachShadow(init);

    const observer = new MutationObserver(handleMutation);

    observer.observe(shadowRoot, {
      attributeFilter: ['popover'],
      childList: true,
      subtree: true,
    });

    return shadowRoot;
  };
}

export function isSupported() {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popover' in HTMLElement.prototype
  );
}

const notSupportedMessage =
  'Not supported on element that does not have valid popover attribute';

// class PopoverObserver {
//   #popovers = new Set<HTMLElement>();

//   #observer = new MutationObserver(this.#callback);

//   #userPopoverChanged(target: Node) {
//     console.log(target);
//   }

//   #callback(mutationList: MutationRecord[]) {
//     mutationList.forEach((mutation) => {
//       switch (mutation.type) {
//         case 'attributes':
//           switch (mutation.attributeName) {
//             case 'popover':
//               this.#userPopoverChanged(mutation.target);
//               break;
//           }
//           break;
//       }
//     });
//   }

//   add(tree: Document | ShadowRoot) {
//     const popovers = tree.querySelectorAll('[popover]');
//     console.log(tree);

//     popovers.forEach((popover) => {
//       console.log(popover instanceof HTMLElement);
//       if (popover instanceof HTMLElement) {
//         this.#popovers.add(popover);
//         console.log([...this.#popovers]);
//       }
//     });

//     this.#observer.observe(tree, {
//       attributeFilter: ['popover'],
//       childList: true,
//       subtree: true,
//     });
//   }

//   // get popovers() {
//   //   return this.#popovers;
//   // }
// }

export function apply() {
  // const popoverObserver = new PopoverObserver();
  // popoverObserver.add(document);
  // patchAttachShadow((shadowRoot) => popoverObserver.add(shadowRoot));
  patchAttachShadow();

  const visibleElements = new WeakSet<HTMLElement>();

  Object.defineProperties(HTMLElement.prototype, {
    popover: {
      enumerable: true,
      configurable: true,
      get() {
        const value = (this.getAttribute('popover') || '').toLowerCase();
        if (value === 'manual') return 'manual';
        if (value === '' || value == 'auto') return 'auto';
        return null;
      },
      set(value) {
        this.setAttribute('popover', value);
      },
    },

    showPopover: {
      enumerable: true,
      configurable: true,
      value() {
        if (!this.popover)
          throw new DOMException(notSupportedMessage, 'NotSupportedError');
        if (visibleElements.has(this))
          throw new DOMException(
            'Invalid on already-showing Popovers',
            'InvalidStateError',
          );
        this.classList.add(':open');
        visibleElements.add(this);
        if (this.popover === 'auto') {
          const focusEl = this.hasAttribute('autofocus')
            ? this
            : this.querySelector('[autofocus]');
          focusEl?.focus();
        }
      },
    },

    hidePopover: {
      enumerable: true,
      configurable: true,
      value() {
        if (!this.popover)
          throw new DOMException(notSupportedMessage, 'NotSupportedError');
        if (!visibleElements.has(this))
          throw new DOMException(
            'Invalid on already-hidden Popovers',
            'InvalidStateError',
          );
        this.classList.remove(':open');
        visibleElements.delete(this);
      },
    },
  });

  document.addEventListener('click', (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const doc = target.ownerDocument;
    let effectedPopover = (event
      .composedPath()
      .find((el) => el instanceof HTMLElement && el.hasAttribute('popover')) ||
      null) as HTMLElement | null;
    const button = target.closest(
      '[popovertoggletarget],[popoverhidetarget],[popovershowtarget]',
    );
    const isButton = button instanceof HTMLButtonElement;

    // Handle Popover triggers
    if (isButton && button.hasAttribute('popovershowtarget')) {
      effectedPopover = doc.getElementById(
        button.getAttribute('popovershowtarget') || '',
      );

      if (
        effectedPopover &&
        effectedPopover.popover &&
        !visibleElements.has(effectedPopover)
      ) {
        effectedPopover.showPopover();
      }
    } else if (isButton && button.hasAttribute('popoverhidetarget')) {
      effectedPopover = doc.getElementById(
        button.getAttribute('popoverhidetarget') || '',
      );

      if (
        effectedPopover &&
        effectedPopover.popover &&
        visibleElements.has(effectedPopover)
      ) {
        effectedPopover.hidePopover();
      }
    } else if (isButton && button.hasAttribute('popovertoggletarget')) {
      effectedPopover = doc.getElementById(
        button.getAttribute('popovertoggletarget') || '',
      );

      if (effectedPopover && effectedPopover.popover) {
        if (visibleElements.has(effectedPopover)) {
          effectedPopover.hidePopover();
        } else {
          effectedPopover.showPopover();
        }
      }
    }

    // Dismiss open Popovers
    for (const popover of [...popovers]) {
      if (popover.classList.contains(':open') && popover !== effectedPopover)
        popover.hidePopover();
    }
  });
}
