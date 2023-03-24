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

You will also likely need the CSS file, which supplies some default styles.
Download `popover.css` [from
unpkg.com](https://unpkg.com/browse/@oddbird/popover-polyfill/dist/) and add it
to the appropriate directory in your project. Then, include it where necessary
with a `<link rel=stylesheet>` tag:

```html
<link rel="stylesheet" src="/path/to/popover.css" />
```

Note that default styles will not be applied to shadow roots.
Each root node will need to include the styles separately.

### With npm

For more advanced configuration, you can install with
[npm](https://www.npmjs.com/):

```sh
npm install @oddbird/popover-polyfill
```

After installing, you’ll need to use appropriate tooling to use
`node_modules/@oddbird/popover-polyfill/dist/popover.js`.

You will also likely need to include the CSS stylesheet which is found in
`node_modules/@oddbird/popover-polyfill/dist/popover.css`.

If you want to manually apply the polyfill, you can instead import the
`isSupported` and `apply` functions directly from
`node_modules/@oddbird/popover-polyfill/dist/popover-fn.js` file.

### Via CDN

For prototyping or testing, you can use the npm package via a Content Delivery
Network. Avoid using JavaScript CDNs in production, for [many good
reasons](https://blog.wesleyac.com/posts/why-not-javascript-cdn) such as
performance and robustness.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@oddbird/popover-polyfill@latest/dist/popover.css"
  crossorigin="anonymous"
/>
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

- Native `popover` has an `:open` and `:closed` pseudo selector state. This is
  not possible to polyfill, so instead this adds the `.\:open` CSS class to any
  open popover.

  - `:closed` is not implemented due to difficulty in finding popover elements
    during page load. As such, you'll need to style them using `:not(.\:open)`.

  - Using native `:open` in CSS that does not support native `popover` results
    in an invalid selector, and so the entire declaration is thrown away. This
    is important because if you intend to style a popover using `.\:open` it
    will need to be a separate declaration. For example,
    `[popover]:open, [popover].\:open` will not work.

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

## Contributing

Visit our [contribution guidelines](https://github.com/oddbird/popover-polyfill/blob/main/CONTRIBUTING.md).
