import { observePopoversMutations, popovers } from './observar.js';

export function isSupported() {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popover' in HTMLElement.prototype
  );
}

const notSupportedMessage =
  'Not supported on element that does not have valid popover attribute';

function patchAttachShadow(callback: (shadowRoot: ShadowRoot) => void) {
  Element.prototype._originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadowRoot = this._originalAttachShadow(init);
    callback(shadowRoot);
    return shadowRoot;
  };
}

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

export function apply() {
  observePopoversMutations(document);
  patchAttachShadow(observePopoversMutations);

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
    let effectedPopover = closestElement(
      '[popover]',
      target,
    ) as HTMLElement | null;
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
      effectedPopover =
        [...popovers].find(
          (popover) =>
            popover.getAttribute('id') ===
            button.getAttribute('popovertoggletarget'),
        ) || null;

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
      if (
        popover.matches('[popover="" i].\\:open, [popover=auto i].\\:open') &&
        popover !== effectedPopover
      )
        popover.hidePopover();
    }
  });
}
