const popoverSet = new Set<HTMLElement>();

const childOListCallback = (mutation: MutationRecord) => {
  if (mutation.addedNodes.length > 0) {
    mutation.addedNodes.forEach((node) => {
      if (node instanceof HTMLElement) {
        if (node.hasAttribute('popover')) {
          console.log(node);
          popoverSet.add(node);
        }
      }
    });
  }

  if (mutation.removedNodes.length > 0) {
    console.log('do something about removed nodes');
  }
};

const callback = (mutationList: MutationRecord[]) => {
  mutationList.forEach((mutation) => {
    switch (mutation.type) {
      case 'attributes':
        switch (mutation.attributeName) {
          case 'popover':
            console.log('do something about popover attribute');
            break;
        }
        break;
      case 'childList':
        childOListCallback(mutation);
    }
  });
};

const observer = new MutationObserver(callback);

function patchAttachShadow() {
  Element.prototype._originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadowRoot = this._originalAttachShadow(init);
    observer.observe(shadowRoot, {
      attributeFilter: ['popover'],
      childList: true,
      subtree: true,
    });
    return shadowRoot;
  };
}

function closestComposed(event: Event) {
  return (event
    .composedPath()
    .find((el) => el instanceof HTMLElement && el.hasAttribute('popover')) ||
    null) as HTMLElement | null;
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

class PopoverObserver {
  #popovers = new Set<HTMLElement>();

  #observer = new MutationObserver(this.#callback);

  #userPopoverChanged(target: Node) {
    console.log(target);
  }

  #callback(mutationList: MutationRecord[]) {
    mutationList.forEach((mutation) => {
      switch (mutation.type) {
        case 'attributes':
          switch (mutation.attributeName) {
            case 'popover':
              this.#userPopoverChanged(mutation.target);
              break;
          }
          break;
      }
    });
  }

  add(tree: Document | ShadowRoot) {
    const popovers = tree.querySelectorAll('[popover]');
    console.log(tree);

    popovers.forEach((popover) => {
      console.log(popover instanceof HTMLElement);
      if (popover instanceof HTMLElement) {
        this.#popovers.add(popover);
        console.log([...this.#popovers]);
      }
    });

    this.#observer.observe(tree, {
      attributeFilter: ['popover'],
      childList: true,
      subtree: true,
    });
  }

  // get popovers() {
  //   return this.#popovers;
  // }
}

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
    let effectedPopover = closestComposed(event);
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

    // extract to class getter
    const openPopovers = [...popoverSet].filter((popoverEl) =>
      popoverEl.classList.contains(':open'),
    );
    // Dismiss open Popovers
    for (const popover of openPopovers) {
      if (popover instanceof HTMLElement && popover !== effectedPopover)
        popover.hidePopover();
    }
  });
}
