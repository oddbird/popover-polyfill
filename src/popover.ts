import { ToggleEvent } from './events.js';
import {
  getRootNode,
  hideAllPopoversUntil,
  hidePopover,
  lightDismissOpenPopovers,
  popoverTargetAttributeActivationBehavior,
  showPopover,
  visibilityState,
} from './popover-helpers.js';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ShadowRoot = globalThis.ShadowRoot || function () {};

export function isSupported() {
  return (
    typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popover' in HTMLElement.prototype
  );
}

export function isPolyfilled() {
  // if the `showPopover` method is defined but is not "native code"
  // then we can infer it's been polyfilled
  return Boolean(
    document.body?.showPopover &&
      !/native code/i.test(document.body.showPopover.toString()),
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

function hasLayerSupport() {
  return typeof globalThis.CSSLayerBlockRule === 'function';
}

// To emulate a UA stylesheet which is the lowest priority in the cascade,
// all selectors must be wrapped in a :where() which has a specificity of zero.
function getStyles() {
  const useLayer = hasLayerSupport();
  return `
${useLayer ? '@layer popover-polyfill {' : ''}
  :where([popover]) {
    position: fixed;
    z-index: 2147483647;
    inset: 0;
    padding: 0.25em;
    width: fit-content;
    height: fit-content;
    border-width: initial;
    border-color: initial;
    border-image: initial;
    border-style: solid;
    background-color: canvas;
    color: canvastext;
    overflow: auto;
    margin: auto;
  }

  :where([popover]:not(.\\:popover-open)) {
    display: none;
  }

  :where(dialog[popover].\\:popover-open) {
    display: block;
  }

  :where(dialog[popover][open]) {
    display: revert;
  }

  :where([anchor].\\:popover-open) {
    inset: auto;
  }

  :where([anchor]:popover-open) {
    inset: auto;
  }

  @supports not (background-color: canvas) {
    :where([popover]) {
      background-color: white;
      color: black;
    }
  }

  @supports (width: -moz-fit-content) {
    :where([popover]) {
      width: -moz-fit-content;
      height: -moz-fit-content;
    }
  }

  @supports not (inset: 0) {
    :where([popover]) {
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }
${useLayer ? '}' : ''}
`;
}

let popoverStyleSheet: null | false | CSSStyleSheet = null;
export function injectStyles(root: Document | ShadowRoot) {
  const styles = getStyles();
  if (popoverStyleSheet === null) {
    try {
      popoverStyleSheet = new CSSStyleSheet();
      popoverStyleSheet.replaceSync(styles);
    } catch {
      popoverStyleSheet = false;
    }
  }
  if (popoverStyleSheet === false) {
    const sheet = document.createElement('style');
    sheet.textContent = styles;
    if (root instanceof Document) {
      root.head.prepend(sheet);
    } else {
      root.prepend(sheet);
    }
  } else {
    root.adoptedStyleSheets = [popoverStyleSheet, ...root.adoptedStyleSheets];
  }
}

export function apply() {
  if (typeof window === 'undefined') return;

  window.ToggleEvent = window.ToggleEvent || ToggleEvent;

  function rewriteSelector(selector: string) {
    if (selector?.includes(':popover-open')) {
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

  const originalAttachShadow = Element.prototype.attachShadow;
  if (originalAttachShadow) {
    Object.defineProperties(Element.prototype, {
      attachShadow: {
        enumerable: true,
        configurable: true,
        writable: true,
        value(options: ShadowRootInit) {
          const shadowRoot = originalAttachShadow.call(this, options);
          injectStyles(shadowRoot);
          return shadowRoot;
        },
      },
    });
  }
  const originalAttachInternals = HTMLElement.prototype.attachInternals;
  if (originalAttachInternals) {
    Object.defineProperties(HTMLElement.prototype, {
      attachInternals: {
        enumerable: true,
        configurable: true,
        writable: true,
        value() {
          const internals = originalAttachInternals.call(this);
          if (internals.shadowRoot) {
            injectStyles(internals.shadowRoot);
          }
          return internals;
        },
      },
    });
  }

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
          const root = getRootNode(this);
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
    // Composed path allows us to find the target within shadowroots
    const composedPath = event.composedPath() as HTMLElement[];
    const target = composedPath[0];
    if (!(target instanceof Element) || target?.shadowRoot) {
      return;
    }
    const root = getRootNode(target);
    if (!(root instanceof ShadowRoot || root instanceof Document)) {
      return;
    }
    const invoker = composedPath.find((el) =>
      el.matches?.('[popovertargetaction],[popovertarget]'),
    );
    if (invoker) {
      popoverTargetAttributeActivationBehavior(invoker as HTMLButtonElement);
      event.preventDefault();
      return;
    }
  };

  const onKeydown = (event: Event) => {
    const key = (event as KeyboardEvent).key;
    const target = event.target as Element;
    if (
      !event.defaultPrevented &&
      target &&
      (key === 'Escape' || key === 'Esc')
    ) {
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
  injectStyles(document);
}
