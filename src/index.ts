import {isSupported, apply} from './popup.js'

if (!isSupported()) apply()

declare global {
  interface HTMLElement {
    popUp: 'auto' | 'hint' | 'manual'
    defaultOpen: boolean
    showPopUp(): void
    hidePopUp(): void
  }
}
