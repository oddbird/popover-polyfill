import {
  checkInvokerValidity,
  getContainingPopovers,
  getPopoverTargetElementFromIdref,
  SupportingPopoverTargetAttributesSelector,
} from './invokers.js';
import { observePopoversMutations, popovers } from './observer.js';

export function isSupported() {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popover' in HTMLElement.prototype
  );
}

function patchAttachShadow(callback: (shadowRoot: ShadowRoot) => void) {
  const originalAttachShadow = Element.prototype.attachShadow;
  Element.prototype.attachShadow = function (init) {
    const shadowRoot = originalAttachShadow.call(this, init);
    callback(shadowRoot);
    return shadowRoot;
  };
}

export function apply() {
  const visibleElements = new WeakSet<HTMLElement>();

  // https://whatpr.org/html/8221/popover.html#check-popover-validity
  function checkPopoverValidity(
    element: HTMLElement,
    expectedToBeShowing: boolean,
  ) {
    if (element.popover !== 'auto' && element.popover !== 'manual')
      return false;
    if (!element.isConnected) return false;
    if (element instanceof HTMLDialogElement && element.hasAttribute('open'))
      return false;
    if (expectedToBeShowing && !visibleElements.has(element)) return false;
    if (!expectedToBeShowing && visibleElements.has(element)) return false;
    if (document.fullscreenElement === element) return false;
    return true;
  }

  function assertPopoverValidity(
    element: HTMLElement,
    expectedToBeShowing: boolean,
  ) {
    if (!checkPopoverValidity(element, expectedToBeShowing)) {
      throw new DOMException(
        'Cannot show or hide popover on invalid or already visible element',
        'InvalidStateError',
      );
    }
  }

  interface BeforeToggleInit extends EventInit {
    currentState: string;
    newState: string;
  }

  class BeforeToggleEvent extends Event {
    public currentState: string;
    public newState: string;
    constructor(
      type: string,
      {
        currentState = '',
        newState = '',
        ...init
      }: Partial<BeforeToggleInit> = {},
    ) {
      super(type, init);
      this.currentState = String(currentState || '');
      this.newState = String(newState || '');
    }
  }
  window.BeforeToggleEvent = window.BeforeToggleEvent || BeforeToggleEvent;

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
        // https://whatpr.org/html/8221/popover.html#show-popover
        assertPopoverValidity(this, false);
        const event = new BeforeToggleEvent('beforetoggle', {
          cancelable: true,
          currentState: 'closed',
          newState: 'open',
        });
        if (!this.dispatchEvent(event)) return;
        assertPopoverValidity(this, false);
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
        // https://whatpr.org/html/8221/popover.html#hide-popover
        assertPopoverValidity(this, true);
        this.dispatchEvent(
          new BeforeToggleEvent('beforetoggle', {
            cancelable: false,
            currentState: 'open',
            newState: 'closed',
          }),
        );
        assertPopoverValidity(this, true);
        this.classList.remove(':open');
        visibleElements.delete(this);
      },
    },
  });

  const onClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element) || target?.shadowRoot) {
      return;
    }
    const root = target.getRootNode();
    if (!(root instanceof ShadowRoot || root instanceof Document)) {
      return;
    }
    let popoverTargetElement: HTMLElement | null = null;
    const invoker = target.closest(SupportingPopoverTargetAttributesSelector);
    if (invoker instanceof HTMLElement && checkInvokerValidity(invoker)) {
      if (
        // If node has a popovertoggletarget attribute, then set idref to the value of node's popovertoggletarget attribute.
        invoker.getAttribute('popovertoggletarget') ||
        invoker.popoverToggleTargetElement
      ) {
        popoverTargetElement =
          getPopoverTargetElementFromIdref(invoker, 'popovertoggletarget') ||
          invoker.popoverToggleTargetElement;
        if (popoverTargetElement) {
          if (visibleElements.has(popoverTargetElement)) {
            popoverTargetElement.hidePopover();
          } else {
            popoverTargetElement.showPopover();
          }
        }
      } else if (
        // Otherwise, if node has a popovershowtarget attribute, then set idref to the value of node's popovershowtarget attribute.
        invoker.getAttribute('popovershowtarget') ||
        invoker.popoverShowTargetElement
      ) {
        popoverTargetElement =
          getPopoverTargetElementFromIdref(invoker, 'popovershowtarget') ||
          invoker.popoverShowTargetElement;
        popoverTargetElement?.showPopover();
      } else if (
        // Otherwise, if node has a popoverhidetarget attribute, then set idref to the value of node's popoverhidetarget attribute.
        invoker.getAttribute('popoverhidetarget') ||
        invoker.popoverHideTargetElement
      ) {
        popoverTargetElement =
          getPopoverTargetElementFromIdref(invoker, 'popoverhidetarget') ||
          invoker.popoverHideTargetElement;
        popoverTargetElement?.hidePopover();
      }
      // Dismiss open 'auto' popovers which are not the containing popovers and are not the target popover element
      for (const popover of [...popovers]) {
        if (
          popover.matches('[popover="" i].\\:open, [popover=auto i].\\:open') &&
          ![
            ...getContainingPopovers(target),
            ...(popoverTargetElement ? [popoverTargetElement] : []),
          ].includes(popover)
        ) {
          popover.hidePopover();
        }
      }
    }
  };

  const addOnClickEventListener = (
    (callback: (event: Event) => void) => (root: Document | ShadowRoot) => {
      root.addEventListener('click', callback);
    }
  )(onClick);

  observePopoversMutations(document);
  addOnClickEventListener(document);

  patchAttachShadow(observePopoversMutations);
  patchAttachShadow(addOnClickEventListener);

  Object.defineProperty(HTMLElement.prototype, 'popoverToggleTargetElement', {
    set: function (el: unknown) {
      if (!(el instanceof Element)) {
        throw new TypeError('popoverToggleTargetElement must be an element');
      }
      this._popoverToggleTargetElement = new WeakRef(el);
    },
    get: function () {
      return this._popoverToggleTargetElement?.deref() || null;
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'popoverShowTargetElement', {
    set: function (el: unknown) {
      if (!(el instanceof Element)) {
        throw new TypeError('popoverShowTargetElement must be an element');
      }
      this._popoverShowTargetElement = new WeakRef(el);
    },
    get: function () {
      return this._popoverShowTargetElement?.deref() || null;
    },
  });

  Object.defineProperty(HTMLElement.prototype, 'popoverHideTargetElement', {
    set: function (el: unknown) {
      if (!(el instanceof Element)) {
        throw new TypeError('popoverHideTargetElement must be an element');
      }
      this._popoverHideTargetElement = new WeakRef(el);
    },
    get: function () {
      return this._popoverHideTargetElement?.deref() || null;
    },
  });
}
