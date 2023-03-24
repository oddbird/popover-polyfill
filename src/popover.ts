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

export function apply() {
  window.ToggleEvent = window.ToggleEvent || ToggleEvent;

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
      value() {
        showPopover(this);
      },
    },

    hidePopover: {
      enumerable: true,
      configurable: true,
      value() {
        hidePopover(this, true, true);
      },
    },

    togglePopover: {
      enumerable: true,
      configurable: true,
      value(force: boolean) {
        if (
          (visibilityState.get(this) === 'showing' && force === undefined) ||
          force === false
        ) {
          hidePopover(this, true, true);
        } else if (force === undefined || force === true) {
          showPopover(this);
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
          if (!targetElement?.isConnected) {
            popoverTargetAssociatedElements.delete(this);
          }
          if (targetElement) {
            return targetElement;
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
