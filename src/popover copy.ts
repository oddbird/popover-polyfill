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
    // https://whatpr.org/html/8221/popover.html#popover-trigger
    // query elements which support the popover target attributes
    // The popover target attributes are only supported on the following elements:
    // button elements
    // input elements in the Button state.
    // input elements in the Submit Button state.
    // input elements in the Image Button state.
    // input elements in the Reset Button state.
    let effectedPopover = closestElement(
      '[popover]',
      target,
    ) as HTMLElement | null;

    const getPopoverTargetElement = (target: Element) => {
      const popoverInvoker = target.closest(
        ':is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"])',
      );

      const popoverTargetElement = closestElement(
        '[popoverhidetarget],[popovershowtarget],[popovertoggletarget]',
        target,
      ) as HTMLElement | null;
      return popoverTargetElement;
    };

    const popoverInvoker = target.closest(
      ':is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"])',
    );

    const popoverTargetElement


    // extract outside to module scope
    const button = (target: Element) => {
      const popoverInvoker = target.closest(
        ':is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"])',
      );

      const popoverTargetElement = closestElement(
        '[popoverhidetarget],[popovershowtarget],[popovertoggletarget]',
        target,
      ) as HTMLElement | null;
      return popoverTargetElement;
    };
    popoverTargetElement: HTMLElement | null = getPopoverTargetElement(target);
    // const popoverTargetSupportingElements =
    //   ':is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"])'; // css selector for elements which support popover target attributes
    // const popoverTargetAttributes =
    //   ':is([popovertoggletarget],[popoverhidetarget],[popovershowtarget])'; // css selector for popover target attributes
    const isTargettingElement: (el: Element | null) => HTMLElement = (el: Element | null) => {
      const isButton = popoverTargetElement instanceof HTMLButtonElement;
      // If node is not supported, then return null.
      // If node is disabled, then return null.
      // If node has a form owner and node is a submit button, then return null.
      // Let idref be null.
      // If node has a popovertoggletarget attribute, then set idref to the value of node's popovertoggletarget attribute.
      //       Otherwise, if node has a popovershowtarget attribute, then set idref to the value of node's popovershowtarget attribute.
      //       Otherwise, if node has a popoverhidetarget attribute, then set idref to the value of node's popoverhidetarget attribute.
      // If idref is null, then return null.
      // Let popoverElement be the first element in tree order, within node's root's descendants, whose ID is idref; otherwise, if there is no such element, null.
      // If popoverElement is null, then return null.
      // If popoverElement's popover attribute is in the no popover state, then return null.
      // Return popoverElement.
    };


    // handle popover invoker
    if (popoverTargetElement) {
      effectedPopover = root.getElementById(
        popoverTargetElement.getAttribute('popovershowtarget') || '',
      );

      if (
        effectedPopover &&
        effectedPopover.popover &&
        !visibleElements.has(effectedPopover)
      ) {
        effectedPopover.showPopover();
      }
    } else if (isButton && popoverTargetElement.hasAttribute('popoverhidetarget')) {
      effectedPopover = root.getElementById(
        popoverTargetElement.getAttribute('popoverhidetarget') || '',
      );

      if (
        effectedPopover &&
        effectedPopover.popover &&
        visibleElements.has(effectedPopover)
      ) {
        effectedPopover.hidePopover();
      }
    } else if (
      isButton &&
      popoverTargetElement.hasAttribute('popovertoggletarget')
    ) {
      effectedPopover = root.getElementById(
        popoverTargetElement.getAttribute('popovertoggletarget') || '',
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
      if (
        popover.matches('[popover="" i].\\:open, [popover=auto i].\\:open') &&
        popover !== effectedPopover
      )
        popover.hidePopover();
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
      return this._popoverToggleTargetElement;
    },
  });
}
