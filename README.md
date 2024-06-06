# Popover Attribute Polyfill

[![Build Status](https://github.com/oddbird/popover-polyfill/actions/workflows/test.yml/badge.svg)](https://github.com/oddbird/popover-polyfill/actions/workflows/test.yml) [![npm version](https://badge.fury.io/js/@oddbird%2Fpopover-polyfill.svg)](https://badge.fury.io/js/@oddbird%2Fpopover-polyfill) [![Netlify Status](https://api.netlify.com/api/v1/badges/35bc7ba7-97a2-4e41-93ed-5141988adb1e/deploy-status)](https://app.netlify.com/sites/popover-polyfill/deploys)

- [Demo](https://popover-polyfill.netlify.app/)
- [Explainer](https://open-ui.org/components/popover.research.explainer/)

This polyfills the HTML `popover` attribute and
`showPopover`/`hidePopover`/`togglePopover` methods onto HTMLElement, as well as
the `popovertarget` and `popovertargetaction` attributes on Button elements.

## Polyfill Installation

### Download a copy

The simplest, recommended way to install the polyfill is to copy it into your
project.

Download `popover.js` (or `popover.min.js`) [from
unpkg.com](https://unpkg.com/browse/@oddbird/popover-polyfill/dist/) and add it
to the appropriate directory in your project. Then, include it where necessary
with a `<script>` tag:

```html
<script src="/path/to/popover.min.js" type="module"></script>
```

Or without [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules):

```html
<script src="/path/to/popover.iife.min.js"></script>
```

Note that the JS will inject CSS styles into your document (or ShadowRoot).

### With npm

For more advanced configuration, you can install with
[npm](https://www.npmjs.com/):

```sh
npm install @oddbird/popover-polyfill
```

After installing, you’ll need to use appropriate tooling to use
`node_modules/@oddbird/popover-polyfill/dist/popover.js`.

For most tooling such as Vite, Webpack, and Parcel, that will look like this:

```js
import '@oddbird/popover-polyfill';
```

If you want to manually apply the polyfill, you can instead import the
`isSupported` and `apply` functions directly from
`node_modules/@oddbird/popover-polyfill/dist/popover-fn.js` file.

With most tooling:

```js
import { apply, isSupported } from '@oddbird/popover-polyfill/fn';
```

A special `isPolyfilled` function is also available, to detect if the Popover methods have been polyfilled:

```js
import { isPolyfilled } from '@oddbird/popover-polyfill/fn';
```

### Via CDN

For prototyping or testing, you can use the npm package via a Content Delivery
Network. Avoid using JavaScript CDNs in production, for [many good
reasons](https://blog.wesleyac.com/posts/why-not-javascript-cdn) such as
performance and robustness.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@oddbird/popover-polyfill@latest"
  crossorigin="anonymous"
  defer
></script>
```

## Usage

After installation the polyfill will automatically add the correct methods and
attributes to the HTMLElement class.

## Caveats

This polyfill is not a perfect replacement for the native behavior; there are
some caveats which will need accommodations:

- A native `popover` has a `:popover-open` pseudo selector when in the open
  state. Pseudo selectors cannot be polyfilled within CSS, and so instead the
  polyfill will add the `.\:popover-open` CSS class to any open popover. In
  other words a popover in the open state will have `class=":popover-open"`. In
  CSS the `:` character must be escaped with a backslash.

  - The `:popover-open` selector within JavaScript methods has been polyfilled,
    so both `.querySelector(':popover-open')` _and_
    `.querySelector('.\:popover-open')` will work to select the same element.
    `matches` and `closest` have also been patched, so
    `.matches(':popover-open')` will work the same as
    `.matches('.\:popover-open')`.

  - Using native `:popover-open` in CSS that does not support native `popover`
    results in an invalid selector, and so the entire declaration is thrown
    away. This is important because if you intend to style a popover using
    `.\:popover-open` it will need to be a separate declaration. For example,
    `[popover]:popover-open, [popover].\:popover-open` will not work.

- Native `popover` elements use the `:top-layer` pseudo element which gets
  placed above all other elements on the page, regardless of overflow or
  z-index. This is not possible to polyfill, and so this library simply sets a
  really high `z-index`. This means if a popover is within an element that has
  `overflow:` or `position:` CSS, then there will be visual differences between
  the polyfill and the native behavior.

- Native _invokers_ (that is, buttons or inputs using the `popovertarget`
  attribute) on `popover=auto` will render in the accessibility tree as elements
  with `expanded`. The only way to do this in the polyfill is setting the
  `aria-expanded` attribute on those elements. This _may_ impact mutation
  observers or frameworks which do DOM diffing, or it may interfere with other
  code which sets `aria-expanded` on elements.

- The polyfill uses `adoptedStyleSheets` to inject CSS onto the page (and each
  Shadow DOM). If it can't use that it'll generate a `<style>` tag instead. This
  means you may see a `<style>` tag you didn't put there, and this _may_ impact
  mutation observers or frameworks.

  - For browsers which don't support `adoptedStyleSheets` on Shadow Roots, if
    you are building a ShadowRoot by setting `.innerHTML`, you'll remove the
    StyleSheet. Either polyfill `adoptedStyleSheets` or call
    `injectStyles(myShadow)` to add the styles back in.

  - Similarly, if you're using Declarative ShadowDOM or otherwise creating a
    shadow root without calling `attachShadow`/`attachInternals`, then the
    polyfill won't inject the styles (because it can't reference the
    `shadowRoot`). You'll need to manually inject the styles yourself with
    `injectStyles(myShadow)`.

  - As a stylesheet is injected into the main document, if your host element is
    a popover, styling with `:host` gets tricky beause `:host` styles always
    take lower precedence than the main document styles. This is a limitation
    of CSS and there's not a reasonable workaround. The best workaround for
    now is to add `!important` to conflicting properties in your `:host` rule.
    See [#147](https://github.com/oddbird/popover-polyfill/issues/147) for more.

  - Given that the CSS is injected using JavaScript, you may find that you
    temporarily see popovers as open while the JS is loading. To work around
    this, you can add the following CSS to your project:

    ```css
    @supports not selector(:popover-open) {
      [popover]:not(.\:popover-open) {
        display: none;
      }
    }
    ```

- When supported, the polyfill creates a cascade layer named `popover-polyfill`.
  If your styles are not in layers then this should have no impact. If your
  styles do use layers, you'll need to ensure the polyfill layer is declared
  first. (e.g. `@layer popover-polyfill, other, layers;`)

- The polyfill will not work in browsers with partial popover support enabled,
  and will also not attempt to make experimental support match the final spec.

## Contributing

Visit our [contribution guidelines](https://github.com/oddbird/popover-polyfill/blob/main/CONTRIBUTING.md).

## Sponsor OddBird's OSS Work

At OddBird, we love contributing to the languages & tools developers rely on.
We're currently working on polyfills
for new Popover & Anchor Positioning functionality,
as well as CSS specifications for functions, mixins, and responsive typography.
Help us keep this work sustainable
and centered on your needs as a developer!
We display sponsor logos and avatars
on our [website](https://www.oddbird.net/polyfill/#open-source-sponsors).

[Sponsor OddBird's OSS Work](https://opencollective.com/oddbird-open-source)
