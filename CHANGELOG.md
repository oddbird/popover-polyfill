# Popover Attribute Polyfill Changelog

## 0.7.0: 2026-06-29

- 🚀 NEW: Add `layerName` option (see [documentation](https://github.com/oddbird/popover-polyfill#configuration)) --
  [#283](https://github.com/oddbird/popover-polyfill/pull/283)
- 📝 DOCS: Document `:where` selector option --
  [#276](https://github.com/oddbird/popover-polyfill/pull/276)
- 🏠 INTERNAL: Pin node for Playwright support --
  [#284](https://github.com/oddbird/popover-polyfill/pull/284)
- 🏠 INTERNAL: Upgrade dependencies

## 0.6.1: 2025-06-26

- 🐛 BUGFIX: Respect `defaultPrevented` in `popovertarget` click handler --
  [#251](https://github.com/oddbird/popover-polyfill/pull/251)
- 📝 DOCS: Add position notes --
  [#252](https://github.com/oddbird/popover-polyfill/pull/252)
- 📝 DOCS: Add example for `backdrop` --
  [#247](https://github.com/oddbird/popover-polyfill/pull/247)
- 📝 DOCS: Document browser support --
  [#250](https://github.com/oddbird/popover-polyfill/pull/250)
- 🏠 INTERNAL: Upgrade dependencies

## 0.6.0: 2025-05-02

- 🚀 NEW: Support for `popover=hint` --
  [#240](https://github.com/oddbird/popover-polyfill/pull/240)
- 🚀 NEW: Support object options syntax for `togglePopover` and `showPopover` --
  [#243](https://github.com/oddbird/popover-polyfill/pull/243)
- 🚀 NEW: Return showing status from `togglePopover` by @jamesnw --
  [#246](https://github.com/oddbird/popover-polyfill/pull/246)
- 📝 DOCS: Clean up styles for older browsers --
  [#236](https://github.com/oddbird/popover-polyfill/pull/236)
- 🏠 INTERNAL: Upgrade dependencies

## 0.5.2: 2024-11-20

- 📝 DOCS: Add favicon, sponsor text, and new demo page URL --
  [#230](https://github.com/oddbird/popover-polyfill/pull/230)
- 🏠 INTERNAL: Upgrade dependencies

## 0.5.1: 2024-11-11

- 🐛 BUGFIX: Fix setting `el.popover = null` --
  [#229](https://github.com/oddbird/popover-polyfill/pull/229)
- 🏠 INTERNAL: Upgrade dependencies

## 0.5.0: 2024-10-08

- 💥 BREAKING: `main` entry point (used by
  `require("@oddbird/popover-polyfill")`) now points to the default build, which
  automatically applies the polyfill --
  [#223](https://github.com/oddbird/popover-polyfill/pull/223)
- 🚀 NEW: Add CommonJS build --
  [#223](https://github.com/oddbird/popover-polyfill/pull/223)
- 🏠 INTERNAL: Upgrade dependencies

## 0.4.4: 2024-07-22

- 🐛 BUGFIX: Add support for slotting elements into popovers --
  [#215](https://github.com/oddbird/popover-polyfill/pull/215)
- 📝 DOCS: Expand and style the demo page --
  [#187](https://github.com/oddbird/popover-polyfill/pull/187)
- 🏠 INTERNAL: Add issue templates, Code of Conduct, and Security policies --
  [#206](https://github.com/oddbird/popover-polyfill/pull/206) and
  [#207](https://github.com/oddbird/popover-polyfill/pull/207)
- 🏠 INTERNAL: Upgrade dependencies

## 0.4.3: 2024-04-26

- 🐛 BUGFIX: Check for `window` before applying polyfill --
  [#201](https://github.com/oddbird/popover-polyfill/pull/201)
- 🐛 BUGFIX: Expose `injectStyles` function --
  [#200](https://github.com/oddbird/popover-polyfill/issues/200)

## 0.4.2: 2024-04-25

- 🐛 BUGFIX: Fix support for `dialog` popovers --
  [#199](https://github.com/oddbird/popover-polyfill/pull/199)
- 🏠 INTERNAL: Upgrade dependencies

## 0.4.1: 2024-03-27

- 🚀 NEW: Add `isPolyfilled` method to check if polyfill is applied --
  [#193](https://github.com/oddbird/popover-polyfill/pull/193)
- 🐛 BUGFIX: Support environments (e.g. SSR) that don't have `window` --
  [#194](https://github.com/oddbird/popover-polyfill/pull/194)
- 🐛 BUGFIX: Support nested popovers inside shadow DOM --
  [#190](https://github.com/oddbird/popover-polyfill/pull/190)
- 📝 DOCS: Add note about FOUC workarounds --
  [#182](https://github.com/oddbird/popover-polyfill/pull/182)
- 🏠 INTERNAL: Switch to Dependabot for dependency updates
- 🏠 INTERNAL: Upgrade dependencies

## 0.4.0: 2024-02-08

- 🚀 NEW: Add support for CSS cascade layers --
  [#178](https://github.com/oddbird/popover-polyfill/pull/178)
- 🐛 BUGFIX: Ensure click events correctly cross out of shadow DOM --
  [#177](https://github.com/oddbird/popover-polyfill/pull/177)
- 🏠 INTERNAL: Upgrade dependencies

## 0.3.8: 2024-01-16

- 🐛 BUGFIX: Allow synthetic click events to target popovers --
  [#170](https://github.com/oddbird/popover-polyfill/pull/170)
- 🏠 INTERNAL: Upgrade dependencies

## 0.3.7: 2023-12-07

- 🐛 BUGFIX: Fix crash in Firefox with shadowed popovers --
  [#160](https://github.com/oddbird/popover-polyfill/pull/160)
- 📝 DOCS: Add better ESM use examples --
  [#161](https://github.com/oddbird/popover-polyfill/pull/161)
- 🏠 INTERNAL: Upgrade dependencies

## 0.3.6: 2023-12-01

- 🐛 BUGFIX: Allow `Esc` to be preventable --
  [#158](https://github.com/oddbird/popover-polyfill/pull/158)
- 📝 DOCS: Add caveat about `:host` styles --
  [#157](https://github.com/oddbird/popover-polyfill/pull/157)

## 0.3.5: 2023-11-29

- 🐛 BUGFIX: Fix incorrect `isFocusable` result for `ShadowRoot` --
  [#155](https://github.com/oddbird/popover-polyfill/pull/155)
- 🚀 NEW: Prepend default styles to lower specificity in the cascade --
  [#156](https://github.com/oddbird/popover-polyfill/pull/156)

## 0.3.4: 2023-11-28

- 🚀 NEW: Wrap styles in `:where()` to lower specificity in the cascade --
  [#153](https://github.com/oddbird/popover-polyfill/pull/153)

## 0.3.3: 2023-11-28

- 🐛 BUGFIX: Check slotted content for autofocus delegate --
  [#150](https://github.com/oddbird/popover-polyfill/pull/150)
- 🏠 INTERNAL: Upgrade dependencies

## 0.3.2: 2023-11-13

- 🚀 NEW: Update TypeScript definitions to be compatible with v5 --
  [#146](https://github.com/oddbird/popover-polyfill/pull/146)
- 🏠 INTERNAL: Upgrade dependencies

## 0.3.1: 2023-10-28

- 🐛 BUGFIX: Assign to `adoptedStyleSheets` rather than using `push` --
  [#141](https://github.com/oddbird/popover-polyfill/pull/141)
- 🏠 INTERNAL: Upgrade dependencies

## 0.3.0: 2023-10-19

- 💥 BREAKING: Automatically inject styles from JS --
  [#137](https://github.com/oddbird/popover-polyfill/pull/137)
- 🏠 INTERNAL: Upgrade dependencies

## 0.2.3: 2023-09-18

- 💥 BREAKING: Drop `:open` styles --
  [#128](https://github.com/oddbird/popover-polyfill/pull/128)
- 📝 DOCS: Fix link in README --
  [#108](https://github.com/oddbird/popover-polyfill/pull/108)
- 🏠 INTERNAL: Upgrade dependencies

## 0.2.2: 2023-06-06

- 🚀 NEW: Add support for older browsers, e.g. Firefox 91, Chrome ~80 --
  [#103](https://github.com/oddbird/popover-polyfill/pull/103)
- 🐛 BUGFIX: Do not error if `querySelector` APIs are invoked with `null` or
  `undefined` -- [#105](https://github.com/oddbird/popover-polyfill/pull/105)
- 🏠 INTERNAL: Upgrade dependencies

## 0.2.1: 2023-05-17

- 🐛 BUGFIX: Fix infinite loop for removed popovers --
  [#99](https://github.com/oddbird/popover-polyfill/pull/99)
- 🐛 BUGFIX: Expose CSS entry point as `@oddbird/popover-polyfill/css` and
  `@oddbird/popover-polyfill/dist/popover.css`
- 🏠 INTERNAL: Upgrade dependencies

## 0.2.0: 2023-04-04

- 🚀 NEW: Support for `:popover-open` pseudo selector, including a polyfill for
  JavaScript API methods (`querySelector`, `querySelectorAll`, `matches`, and
  `closest`) --
  [#84](https://github.com/oddbird/popover-polyfill/pull/84)
- 🐛 BUGFIX: Return `null` for disconnected elements --
  [#90](https://github.com/oddbird/popover-polyfill/pull/90)
- 🏠 INTERNAL: Upgrade dependencies

## 0.1.1: 2023-03-24

- 🐛 BUGFIX: Fix regression when targets have nested elements --
  [#88](https://github.com/oddbird/popover-polyfill/pull/88)
- 📝 DOCS: Add demo site: https://popover.oddbird.net/

## 0.1.0: 2023-03-24

- 💥 BREAKING: Drop support for `popovertoggletarget`, `popovershowtarget` and
  `popoverhidetarget`. These are now `popovertarget` and `popovertargetaction`.
- 💥 BREAKING: Invalid popover attribute values now default to manual, meaning
  `popover=invalid` is, in fact, a valid popover.
- The old `BeforeToggleEvent` has been replaced with `ToggleEvent` which has a
  type of `'beforetoggle'` or `'toggle'`, and the old `currentState` is now
  `oldState`. `newState` remains the same.
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.11: 2023-03-15

- 🚀 NEW: Add support for Escape to dismiss auto popovers --
  [#82](https://github.com/oddbird/popover-polyfill/pull/82)
- 🚀 NEW: Showing an `auto` popover closes other `auto` popovers --
  [#83](https://github.com/oddbird/popover-polyfill/pull/83)
- 🚀 NEW: Add support for focus restoration on popover close --
  [#81](https://github.com/oddbird/popover-polyfill/pull/81)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.10: 2023-03-03

- 🚀 NEW: Add support for `aria-expanded` on invokers --
  [#77](https://github.com/oddbird/popover-polyfill/pull/77)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.9: 2023-02-03

- 🚀 NEW: Add support for JavaScript (IDL) reflections (e.g.
  `popoverToggleTargetElement`) --
  [#70](https://github.com/oddbird/popover-polyfill/pull/70)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.8: 2023-01-26

- 🚀 NEW: Add support for new [`beforetoggle`
  event](https://whatpr.org/html/8221/popover.html#show-popover) --
  [#68](https://github.com/oddbird/popover-polyfill/pull/68)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.7: 2023-01-19

- 🐛 BUGFIX: Fix display issue with native popups --
  [#64](https://github.com/oddbird/popover-polyfill/pull/64)
- 🐛 BUGFIX: Remove `stopPropagation` to allow handlers --
  [#63](https://github.com/oddbird/popover-polyfill/pull/63)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.6: 2023-01-17

- 🚀 NEW: Update CSS to align closer to [Chrome's user-agent
  CSS](https://github.com/chromium/chromium/blob/main/third_party/blink/renderer/core/css/popover.css)
  -- [#60](https://github.com/oddbird/popover-polyfill/pull/60)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.5: 2023-01-14

- 🚀 NEW: Support popovers in shadow roots --
  [#49](https://github.com/oddbird/popover-polyfill/pull/49)
- 🚀 NEW: Use system text and background colors --
  [#55](https://github.com/oddbird/popover-polyfill/pull/55),
  [#56](https://github.com/oddbird/popover-polyfill/pull/56)
- 📝 DOCS: Include CSS in CDN section --
  [#52](https://github.com/oddbird/popover-polyfill/pull/52)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.4: 2022-12-16

- 🐛 BUGFIX: Fix event handling of buttons --
  [#40](https://github.com/oddbird/popover-polyfill/pull/40)
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.3: 2022-11-15

- 💥 BREAKING: Drop support for `hint` and `defaultopen`
- 📝 DOCS: Improve documentation
- 🏠 INTERNAL: Rename popup to popover
- 🏠 INTERNAL: Upgrade dependencies

## 0.0.2: 2022-10-28

- 📝 DOCS: Fix links in documentation

## 0.0.1: 2022-10-26

- 🎉 Initial release
