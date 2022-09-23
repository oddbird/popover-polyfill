export function isSupported() {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popUp' in HTMLElement.prototype
  );
}

const notSupportedMessage =
  'Not supported on element that does not have valid popup attribute';

export function apply() {
  const visibleElements = new WeakSet<HTMLElement>();

  Object.defineProperties(HTMLElement.prototype, {
    popUp: {
      enumerable: true,
      configurable: true,
      get() {
        const value = (this.getAttribute('popup') || '').toLowerCase();
        if (value === 'hint') return 'hint';
        if (value === 'manual') return 'manual';
        if (value === '' || value == 'auto') return 'auto';
        return null;
      },
      set(value) {
        this.setAttribute('popup', value);
      },
    },

    defaultOpen: {
      enumerable: true,
      configurable: true,
      get() {
        return this.hasAttribute('defaultopen');
      },
      set(value) {
        this.toggleAttribute('defaultopen', value);
      },
    },

    showPopUp: {
      enumerable: true,
      configurable: true,
      value() {
        if (!this.popUp)
          throw new DOMException(notSupportedMessage, 'NotSupportedError');
        if (visibleElements.has(this))
          throw new DOMException(
            'Invalid on already-showing popups',
            'InvalidStateError',
          );
        this.classList.add(':open');
        visibleElements.add(this);
        if (this.popUp === 'auto') {
          const focusEl = this.hasAttribute('autofocus')
            ? this
            : this.querySelector('[autofocus]');
          focusEl?.focus();
        }
      },
    },

    hidePopUp: {
      enumerable: true,
      configurable: true,
      value() {
        if (!this.popUp)
          throw new DOMException(notSupportedMessage, 'NotSupportedError');
        if (!visibleElements.has(this))
          throw new DOMException(
            'Invalid on already-hidden popups',
            'InvalidStateError',
          );
        this.classList.remove(':open');
        visibleElements.delete(this);
      },
    },
  });

  function showDefaultOpen() {
    // Only the first auto popup is shown. hint popups are not shown
    const popup = document.querySelector('[popup=auto i][defaultopen]');
    if (popup instanceof HTMLElement) popup.showPopUp();
    // All manual popups are shown
    for (const popup of document.querySelectorAll(
      '[popup=manual i][defaultopen]',
    )) {
      if (popup instanceof HTMLElement) popup.showPopUp();
    }
  }

  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    showDefaultOpen();
  } else {
    document.addEventListener('DOMContentLoaded', showDefaultOpen, {
      once: true,
    });
  }

  document.addEventListener('click', (event: Event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const doc = target.ownerDocument;
    const effectedPopup: HTMLElement | null = target.closest('[popup]');

    // Dismiss open popups
    for (const popup of doc.querySelectorAll(
      '[popup="" i].\\:open, [popup=auto i].\\:open, [popup=hint i].\\:open',
    )) {
      if (popup instanceof HTMLElement && popup !== effectedPopup)
        popup.hidePopUp();
    }
  });
}
