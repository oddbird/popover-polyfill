import { observePopoversMutations, popovers } from './observer.js';
import { queryAncestorAll } from './triggers.js';

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

  const popoverTargetAttributesSupportedElementsSelector =
    ':is(button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"])';

  const definePopoverTargetElementProperty = (name: string) => {
    const invokersMap = new WeakMap<Element, Element>();
    Object.defineProperty(HTMLElement.prototype, `${name}Element`, {
      set(targetElement: unknown) {
        if (targetElement === null) {
          this.removeAttribute(name.toLowerCase());
          invokersMap.delete(this);
        } else if (!(targetElement instanceof Element)) {
          throw new TypeError(`${name}Element must be an element or null`);
        } else {
          this.setAttribute(name.toLowerCase(), '');
          invokersMap.set(this, targetElement);
        }
      },
      get() {
        // If node is not supported, then return null.
        if (!this.matches(popoverTargetAttributesSupportedElementsSelector)) {
          return null;
        }
        // If node is disabled, then return null.
        if (this.disabled) {
          return null;
        }
        // If node has a form owner and node is a submit button, then return null.
        if (this.form && this.type === 'submit') {
          return null;
        }
        // workaround weakref not being available in all browsers by only returning connected elements, explicitly dropping the reference if the element isn't connected
        const targetElement = invokersMap.get(this);
        if (!targetElement?.isConnected) {
          invokersMap.delete(this);
        }
        // Let idref be null.
        // If node has a popovertoggletarget attribute, then set idref to the value of node's popovertoggletarget attribute.
        // Otherwise, if node has a popovershowtarget attribute, then set idref to the value of node's popovershowtarget attribute.
        // Otherwise, if node has a popoverhidetarget attribute, then set idref to the value of node's popoverhidetarget attribute.
        // If idref is null, then return null.
        // Let popoverElement be the first element in tree order, within node's root's descendants, whose ID is idref; otherwise, if there is no such element, null.
        // If popoverElement is null, then return null.
        // If popoverElement's popover attribute is in the no popover state, then return null.
        // Return popoverElement.
        if (targetElement) {
          return targetElement;
        }
        return (
          this.getRootNode().getElementById(
            this.getAttribute(name.toLowerCase()),
          ) || null
        );
      },
    });
  };

  definePopoverTargetElementProperty('popoverToggleTarget');
  definePopoverTargetElementProperty('popoverShowTarget');
  definePopoverTargetElementProperty('popoverHideTarget');

  const handlePopoverTargetElementInvokation = (invoker: Element | null) => {
    if (!(invoker instanceof HTMLButtonElement)) {
      return;
    }
    let popoverTargetElement: HTMLElement | null = null;
    if (invoker.popoverToggleTargetElement) {
      popoverTargetElement = invoker.popoverToggleTargetElement;
      if (popoverTargetElement) {
        if (visibleElements.has(popoverTargetElement)) {
          popoverTargetElement.hidePopover();
        } else {
          popoverTargetElement.showPopover();
        }
      }
    } else if (invoker.popoverShowTargetElement) {
      popoverTargetElement = invoker.popoverShowTargetElement;
      popoverTargetElement?.showPopover();
    } else if (invoker.popoverHideTargetElement) {
      popoverTargetElement = invoker.popoverHideTargetElement;
      popoverTargetElement?.hidePopover();
    }
    return popoverTargetElement;
  };

  const onClick = (event: Event) => {
    const target = event.target;
    if (!(target instanceof Element) || target?.shadowRoot) {
      return;
    }
    const root = target.getRootNode();
    if (!(root instanceof ShadowRoot || root instanceof Document)) {
      return;
    }
    const invoker = target.closest(
      popoverTargetAttributesSupportedElementsSelector,
    );
    // if (invoker instanceof HTMLElement && checkInvokerValidity(invoker)) {
    const popoverTargetElement = handlePopoverTargetElementInvokation(invoker);
    // }
    // Dismiss open 'auto' popovers which are not the containing popovers and are not the target popover element
    for (const popover of [...popovers]) {
      if (
        popover.matches('[popover="" i].\\:open, [popover=auto i].\\:open') &&
        popover !== popoverTargetElement &&
        !queryAncestorAll(target, '[popover]').includes(popover)
      ) {
        popover.hidePopover();
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
}
