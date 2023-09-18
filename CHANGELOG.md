# Popover Attribute Polyfill Changelog

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
- 📝 DOCS: Add demo site: https://popover-polyfill.netlify.app/

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
