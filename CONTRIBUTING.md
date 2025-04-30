# Contributing to the Popover Attribute Polyfill

Ideas, issues, and pull-requests are welcome!

- [**Github Issues**](https://github.com/oddbird/<POLYFILL-REPO>/issues/) are the
  best place to request a feature, file a bug, or just ask a question. Also a
  great place to discuss possible features before you submit a PR.
- **Pull Requests** are a big help, if you're willing to jump in and make things
  happen. For a bugfix, or documentation, just jump right in. For major changes
  or new features, it's best to discuss in an issue first.

## Conduct

Please follow the [OddBird Code of Conduct](https://www.oddbird.net/conduct/).

## Development

- Clone the repository.
- Install dependencies: `npm install`.
- Start dev server: `npm run serve`. Visit `localhost:3000`.

## Code style

JS code is formatted with prettier. You can lint the code by running `npm run
lint` and format it with `npm run format`. We recommend setting up your IDE to
automatically format code for you.

## Testing

A complete end-to-end test suite is available in the `tests/` folder.

- Configure Playwright (this step is only required once or when the version of
  `@playwright/test` changes in package.json): `npx playwright install --with-deps`
- Run tests (Chromium only): `npm test`
- Run tests (Chromium, Firefox & Webkit): `npm run test:ci`

## Previewing Pull Requests

Active pull requests on the polyfill can be tested using the built version
hosted within the preview environment.

> **IMPORTANT**
>
> These previews are ephemeral, and will stop working after the pull request is
> merged. Do not use this for any purpose other than testing the pull request.

All polyfills are located within the `/dist` folder of the preview environment.
For instance, the auto-applied version for PR 123 would be available at
https://deploy-preview-123--popover-polyfill.netlify.app/dist/popover.js.
