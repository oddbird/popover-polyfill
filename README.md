# Popover Attribute Polyfill

[Explainer](https://open-ui.org/components/popup.research.explainer)

This polyfills the HTML `popover` attribute and `showPopover`/`hidePopover` methods onto HTMLElement.

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
Each root will need to include the styles explicitly.

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

## Contributing

Visit our [contribution guidelines](https://github.com/oddbird/popover-polyfill/blob/main/CONTRIBUTING.md).
