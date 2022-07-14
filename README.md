# popup polyfill

[Explainer](https://open-ui.org/components/popup.research.explainer#nearest-open-ancestral-pop-up)

This polyfills the HTML `popUp` attribute and `showPopUp`/`hidePopUp` methods onto HTMLElement.

## Polyfill Installation

### Download a copy

The simplest, recommended way to install the polyfill is to copy it into your
project.

Download `popup.iife.min.js` [from
unpkg.com](https://unpkg.com/browse/@oddbird/popup-polyfill/dist/) and add it
to the appropriate directory in your project. Then, include it where necessary
with a `<script>` tag:

```html
<script src="/path/to/popup.iife.min.js" type="module"></script>
```

You will also likely need the CSS file, which supplies some default styles.
Download the `popup.csss` [from
unpkg.com](https://unpkg.com/browse/@oddbird/popup-polyfill/dist/) and add it
to the appropriate directory in your project. Then, include it where necessary
with a `<link rel=stylesheet>` tag:

```html
<link rel="stylesheet" src="/path/to/popup.css">
```

### With npm

For more advanced configuration, you can install with
[npm](https://www.npmjs.com/):

```sh
npm install @oddbird/popup-polyfill
```

After installing, you’ll need to use appropriate tooling to use
`node_modules/@oddbird/popup-polyfill/dist/index.js` (or `.min.js`).

You will also likely need to include the CSS stylesheet which is found in
`node_modules/@oddbird/popup-polyfill/dist/popup.css`.

If you want to manually apply the polyfill, you can also import the
`isSupported` and `apply` functions from
`node_modules/@oddbird/popup-polyfill/dist/popup.js` file.

### Via CDN

For prototyping or testing, you can use the npm package via a Content Delivery
Network. Avoid using JavaScript CDNs in production, for [many good
reasons](https://blog.wesleyac.com/posts/why-not-javascript-cdn) such as
performance and robustness.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@oddbird/popup-polyfill@latest"
  crossorigin="anonymous"
  defer
></script>
```

## Usage

After installation the polyfill will automatically add the correct methods and
attributes to the HTMLElement class.

## Contributing

Visit our [contribution guidelines](https://github.com/oddbird/css-toggles/blob/main/CONTRIBUTING.md).


