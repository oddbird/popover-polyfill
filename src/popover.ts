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

const queryAncestorAll = (
  element: Element,
  selector: string,
  popovers: Element[] = [],
): Element[] => {
  const ancestor = closestElement(selector, element);
  const parent =
    ancestor?.parentElement || (ancestor?.getRootNode() as ShadowRoot)?.host;
  return ancestor && parent
    ? queryAncestorAll(parent, selector, [ancestor, ...popovers])
    : popovers;
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

  const popoverTargetAttributesSupportedElementsSelector =
    'button, input[type="button"], input[type="submit"], input[type="image"], input[type="reset"]';

  const definePopoverTargetElementProperty = (name: string) => {
    const invokersMap = new WeakMap<Element, Element>();
    const invokerDescriptor: PropertyDescriptor &
      ThisType<HTMLButtonElement | HTMLInputElement> = {
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
        if (this.localName !== 'button' && this.localName !== 'input') {
          return null;
        }
        if (
          this.localName === 'input' &&
          this.type !== 'reset' &&
          this.type !== 'image' &&
          this.type !== 'button'
        ) {
          return null;
        }
        if (this.disabled) {
          return null;
        }
        if (this.form && this.type === 'submit') {
          return null;
        }
        const targetElement = invokersMap.get(this);
        if (!targetElement?.isConnected) {
          invokersMap.delete(this);
        }
        if (targetElement) {
          return targetElement;
        }
        const root = this.getRootNode();
        const idref = this.getAttribute(name.toLowerCase());
        if ((root instanceof Document || root instanceof ShadowRoot) && idref) {
          return root.getElementById(idref) || null;
        }
        return null;
      },
    };
    Object.defineProperty(
      HTMLButtonElement.prototype,
      `${name}Element`,
      invokerDescriptor,
    );
    Object.defineProperty(
      HTMLInputElement.prototype,
      `${name}Element`,
      invokerDescriptor,
    );
  };

  definePopoverTargetElementProperty('popoverToggleTarget');
  definePopoverTargetElementProperty('popoverShowTarget');
  definePopoverTargetElementProperty('popoverHideTarget');

  const handlePopoverTargetElementInvokation = (invoker: Element | null) => {
    if (
      !(invoker instanceof HTMLButtonElement) &&
      !(invoker instanceof HTMLInputElement)
    ) {
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
    const popoverTargetElement = handlePopoverTargetElementInvokation(invoker);
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
