export function isSupported() {
  return typeof HTMLElement !== 'undefined' &&
    typeof HTMLElement.prototype === 'object' &&
    'popUp' in HTMLElement.prototype
}

const notSupportedMessage = 'Not supported on element that does not have valid popup attribute'

export function apply() {

  const visibleElements = new Set<HTMLElement>()

  Object.defineProperties(HTMLElement.prototype, {

    popUp: {
      enumerable: true,
      configurable: true,
      get() {
        const value = this.getAttribute('popup').toLowerCase()
        if (value === 'hint') return 'hint'
        if (value === 'manual') return 'manual'
        if (value === '' || value == 'auto') return 'auto'
        return null
      },
      set(value) {
        this.setAttribute('popup', value)
      },
    },

    defaultOpen: {
      enumerable: true,
      configurable: true,
      get() {
        return this.hasAttribute('defaultopen')
      },
      set(value) {
        this.toggleAttribute('defaultopen', value)
      },
    },

    showPopUp: {
      enumerable: true,
      configurable: true,
      value() {
        if (!this.popUp) throw new DOMException(notSupportedMessage, 'NotSupportedError')
        if (visibleElements.has(this)) throw new DOMException('Invalid on already-showing popups', 'InvalidStateError')
        this.style.display = 'block'
        this.style.position = 'fixed'
        visibleElements.add(this)
        if (this.popUp === 'auto') {
          const focusEl = this.hasAttribute('autofocus') ? this : this.querySelector('[autofocus]')
          focusEl?.focus()
        }
      },
    },

    hidePopUp: {
      enumerable: true,
      configurable: true,
      value() {
        if (!this.popUp) throw new DOMException(notSupportedMessage, 'NotSupportedError')
        if (!visibleElements.has(this)) throw new DOMException('Invalid on already-hidden popups', 'InvalidStateError')
        this.style.display = 'none'
        visibleElements.delete(this)
      },
    }

  })
}
