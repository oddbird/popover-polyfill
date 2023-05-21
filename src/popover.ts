import { ToggleEvent } from './events.js';
import {
  hideAllPopoversUntil,
  hidePopover,
  lightDismissOpenPopovers,
  popoverTargetAttributeActivationBehavior,
  showPopover,
  visibilityState,
} from './popover-helpers.js';

export function isSupported() {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popover' in HTMLElement.prototype
  );
}

function patchSelectorFn<K extends string>(
  object: Record<PropertyKey & K, unknown>,
  name: K,
  mapper: (selector: string) => string,
) {
  const original = object[name] as (selectors: string) => NodeList;
  Object.defineProperty(object, name, {
    value(selector: string) {
      return original.call(this, mapper(selector));
    },
  });
}

const nonEscapedPopoverSelector = /(^|[^\\]):popover-open\b/g;

export function apply() {
  window.ToggleEvent = window.ToggleEvent || ToggleEvent;

  function rewriteSelector(selector: string) {
    if (selector.includes(':popover-open')) {
      selector = selector.replace(
        nonEscapedPopoverSelector,
        '$1.\\:popover-open',
      );
    }
    return selector;
  }

  patchSelectorFn(Document.prototype, 'querySelector', rewriteSelector);
  patchSelectorFn(Document.prototype, 'querySelectorAll', rewriteSelector);
  patchSelectorFn(Element.prototype, 'querySelector', rewriteSelector);
  patchSelectorFn(Element.prototype, 'querySelectorAll', rewriteSelector);
  patchSelectorFn(Element.prototype, 'matches', rewriteSelector);
  patchSelectorFn(Element.prototype, 'closest', rewriteSelector);
  patchSelectorFn(
    DocumentFragment.prototype,
    'querySelectorAll',
    rewriteSelector,
  );
  patchSelectorFn(
    DocumentFragment.prototype,
    'querySelectorAll',
    rewriteSelector,
  );

  Object.defineProperties(HTMLElement.prototype, {
    popover: {
      enumerable: true,
      configurable: true,
      get() {
        if (!this.hasAttribute('popover')) return null;
        const value = (this.getAttribute('popover') || '').toLowerCase();
        if (value === '' || value == 'auto') return 'auto';
        return 'manual';
      },
      set(value) {
        this.setAttribute('popover', value);
      },
    },

    showPopover: {
      enumerable: true,
      configurable: true,
      value(options?: { invoker?: HTMLElement }) {
        showPopover(this, options?.invoker);
      },
    },

    hidePopover: {
      enumerable: true,
      configurable: true,
      value(options?: { invoker?: HTMLElement }) {
        hidePopover(this, options?.invoker, true, true);
      },
    },

    togglePopover: {
      enumerable: true,
      configurable: true,
      value(options?: { force?: boolean; invoker?: HTMLElement }) {
        if (
          (visibilityState.get(this) === 'showing' &&
            options?.force === undefined) ||
          options?.force === false
        ) {
          hidePopover(this, options?.invoker, true, true);
        } else if (options?.force === undefined || options?.force === true) {
          showPopover(this, options?.invoker);
        }
      },
    },
  });

  const popoverTargetAssociatedElements = new WeakMap<Element, Element>();
  function applyPopoverInvokerElementMixin(ElementClass: typeof HTMLElement) {
    Object.defineProperties(ElementClass.prototype, {
      popoverTargetElement: {
        enumerable: true,
        configurable: true,
        set(targetElement: unknown) {
          if (targetElement === null) {
            this.removeAttribute('popovertarget');
            popoverTargetAssociatedElements.delete(this);
          } else if (!(targetElement instanceof Element)) {
            throw new TypeError(
              `popoverTargetElement must be an element or null`,
            );
          } else {
            this.setAttribute('popovertarget', '');
            popoverTargetAssociatedElements.set(this, targetElement);
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
          const targetElement = popoverTargetAssociatedElements.get(this);
          if (targetElement && targetElement.isConnected) {
            return targetElement;
          } else if (targetElement && !targetElement.isConnected) {
            popoverTargetAssociatedElements.delete(this);
            return null;
          }
          const root = this.getRootNode();
          const idref = this.getAttribute('popovertarget');
          if (
            (root instanceof Document || root instanceof ShadowRoot) &&
            idref
          ) {
            return root.getElementById(idref) || null;
          }
          return null;
        },
      },
      popoverTargetAction: {
        enumerable: true,
        configurable: true,
        get() {
          const value = (
            this.getAttribute('popovertargetaction') || ''
          ).toLowerCase();
          if (value === 'show' || value === 'hide') return value;
          return 'toggle';
        },
        set(value) {
          this.setAttribute('popovertargetaction', value);
        },
      },
    });
  }

  applyPopoverInvokerElementMixin(HTMLButtonElement);
  applyPopoverInvokerElementMixin(HTMLInputElement);

  const handleInvokerActivation = (event: Event) => {
    if (!event.isTrusted) return;
    // Composed path allows us to find the target within shadowroots
    const target = event.composedPath()[0] as HTMLElement;
    if (!(target instanceof Element) || target?.shadowRoot) {
      return;
    }
    const root = target.getRootNode();
    if (!(root instanceof ShadowRoot || root instanceof Document)) {
      return;
    }
    const invoker = target.closest('[popovertargetaction],[popovertarget]');
    if (invoker) {
      popoverTargetAttributeActivationBehavior(invoker as HTMLButtonElement);
      return;
    }
  };

  const onKeydown = (event: Event) => {
    const key = (event as KeyboardEvent).key;
    const target = event.target as Element;
    if (target && (key === 'Escape' || key === 'Esc')) {
      hideAllPopoversUntil(target.ownerDocument, true, true);
    }
  };

  const addEventListeners = (root: Document | ShadowRoot) => {
    root.addEventListener('click', handleInvokerActivation);
    root.addEventListener('keydown', onKeydown);
    root.addEventListener('pointerdown', lightDismissOpenPopovers);
    root.addEventListener('pointerup', lightDismissOpenPopovers);
  };

  addEventListeners(document);
}
