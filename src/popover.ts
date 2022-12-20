import { querySelectorAllDeep } from 'query-selector-shadow-dom';

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

export function apply() {
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

    // Dismiss open Popovers
    for (const popover of querySelectorAllDeep(
      '[popover="" i].\\:open, [popover=auto i].\\:open',
    )) {
      if (popover instanceof HTMLElement && popover !== effectedPopover)
        popover.hidePopover();
    }
  });
}
