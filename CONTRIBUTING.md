# Contributing

Thanks for helping improve `react-text-truncate-lite`.

## Before opening an issue

- Search existing issues first.
- Confirm the text container has a finite width.
- For flex and grid layouts, check that shrinking ancestors use `min-width: 0`.
- Reproduce the problem with the smallest possible React example.
- For browser issues, include the browser version, OS version, writing direction, font, container width, line count, and whether a custom ellipsis is used.

## Local development

Use Node.js 22 or newer.

```sh
npm install
npm run check
npm run build
npm run example:build
```

`npm run check` runs linting, TypeScript checks, and the test suite. Please run it before submitting a pull request.

## Pull requests

1. Keep each pull request focused on one behavior or improvement.
2. Add or update tests for behavior changes.
3. Update the README when the public API, styling requirements, or browser behavior changes.
4. Preserve the CSS-first path and avoid new runtime dependencies unless there is a strong justification.
5. Explain how you verified LTR, RTL, responsive resizing, and custom ellipsis behavior when relevant.

## Design principles

- Prefer native browser behavior for the common path.
- Measure only when native CSS cannot provide the requested result.
- Keep React as a peer dependency and keep the runtime dependency-free.
- Preserve semantic HTML, forwarded attributes, and server-rendering safety.
- Make compatibility decisions through feature detection rather than user-agent sniffing.

By contributing, you agree that your contribution is licensed under the MIT License.

Maintainers should follow [RELEASING.md](RELEASING.md) for the npm release process.
