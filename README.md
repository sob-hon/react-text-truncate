# react-text-truncate-lite

A small, dependency-free React component for reliable single-line and multiline text truncation.

It prefers native CSS ellipsis and line clamping, measures the DOM only when a fallback or custom ellipsis is needed, responds to container and font changes, and works naturally in both LTR and RTL layouts.

[![CI](https://github.com/sob-hon/react-text-truncate/actions/workflows/ci.yml/badge.svg)](https://github.com/sob-hon/react-text-truncate/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

![Examples of single-line, multiline, RTL, flex-layout, and custom-ellipsis truncation](https://raw.githubusercontent.com/sob-hon/react-text-truncate/main/docs/showcase.png)

## Why this package?

- **Small runtime:** React is the only peer dependency; no styling framework is required.
- **CSS first:** native `text-overflow` and `-webkit-line-clamp` handle the common path.
- **Reliable fallback:** DOM measurement and binary search cover custom ellipses and browsers without line clamp.
- **Responsive:** recalculates after container resizes and web-font loading.
- **RTL-friendly:** inherits writing direction and supports `dir="rtl"` without special configuration.
- **Unicode-aware:** uses `Intl.Segmenter` when available and never splits UTF-16 surrogate pairs in its fallback.
- **Library-ready:** TypeScript declarations, ESM, CommonJS, SSR-safe effects, forwarded refs, and zero bundled React.
- **Battle-tested foundation:** extracted from a production UI component that was QA-tested on older iOS Safari and Chrome releases.

## Installation

```sh
npm install react-text-truncate-lite
```

React 17, 18, or 19 must already be installed in your application.

## Quick start

```tsx
import Truncate from 'react-text-truncate-lite';

export function ProductTitle({ title }: { title: string }) {
  return <Truncate lines={2}>{title}</Truncate>;
}
```

The component renders a `span` by default. Give it a constrained width—directly or through layout—so the browser knows where the text must stop.

```tsx
<Truncate style={{ maxWidth: 280 }}>
  A long product title that should remain on one line
</Truncate>
```

## Common scenarios

### Multiline text

```tsx
<Truncate as="p" lines={3} className="description">
  {description}
</Truncate>
```

```css
.description {
  max-width: 32rem;
  line-height: 1.5;
}
```

An explicit `line-height` is recommended when the measurement fallback may run. It also makes the height of each line predictable.

### Text beside fixed content in a flex row

This is the most common source of “ellipsis is not working” reports. Flex items default to `min-width: auto`, which can prevent them from becoming narrower than their text.

```tsx
<div className="row">
  <div className="textColumn">
    <Truncate className="title">{merchantName}</Truncate>
  </div>
  <span className="badge">20% off</span>
</div>
```

```css
.row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.textColumn,
.title {
  flex: 1;
  min-width: 0;
}

.badge {
  flex-shrink: 0;
  white-space: nowrap;
}
```

Use `min-width: 0` on every shrinking flex ancestor between the available-width container and `Truncate`. Keep badges, prices, icons, and actions at `flex-shrink: 0` when they must stay visible.

### Equal-height product cards

Clamping limits visible lines, but a short title still occupies fewer lines. Reserve the full title area when cards must align:

```tsx
<Truncate
  lines={2}
  className="cardTitle"
  style={{ height: '2.5rem' }}
>
  {productName}
</Truncate>
```

```css
.cardTitle {
  line-height: 1.25rem;
}
```

The reserved height should equal `lines × line-height`.

### Custom “show more” content

```tsx
<Truncate
  lines={3}
  ellipsis={
    <>
      {'… '}
      <button type="button" className="more" onClick={openDescription}>
        Show more
      </button>
    </>
  }
>
  {description}
</Truncate>
```

```css
.more {
  appearance: none;
  padding: 0;
  border: 0;
  color: #2563eb;
  background: none;
  font: inherit;
  cursor: pointer;
}
```

A custom `ellipsis` activates DOM measurement so the component reserves the exact space required by your content. Keep the ellipsis inline, and give the text an explicit line height for consistent multiline measurement.

### RTL text

`Truncate` inherits `direction` from its parent. You can also set it explicitly through the standard `dir` attribute:

```tsx
<section dir="rtl" lang="fa">
  <Truncate lines={2} className="title">
    فروشگاه اینترنتی با یک عنوان طولانی برای نمایش رفتار برش متن
  </Truncate>
</section>
```

Prefer logical CSS properties such as `padding-inline-start` and `margin-inline-end` in surrounding layouts. Native ellipsis and line clamp follow the writing direction, and the custom ellipsis is appended in logical text order.

### Initially hidden containers

Measurement requires a real width. If the text starts inside `display: none`, render it when the panel opens or keep the panel in layout with `visibility: hidden`. Modern browsers will normally remeasure through `ResizeObserver`; conditional rendering is the most reliable option for older browsers.

## API

### `<Truncate>`

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` | required | Plain text to display and truncate. Markup is intentionally not accepted because the JavaScript fallback operates on a text string. |
| `lines` | `number` | `1` | Maximum visible lines. Only positive integers are accepted; invalid values fall back to one line. |
| `ellipsis` | `ReactNode` | native `…` | Custom inline content placed at the truncation point. Providing it enables DOM measurement so its rendered width is reserved. |
| `as` | `'span' \| 'p' \| 'div'` | `'span'` | Semantic HTML element rendered as the outer text container. |
| `className` | `string` | — | Class applied to the outer container. Useful for width, typography, flex behavior, and colors. |
| `style` | `CSSProperties` | — | Inline styles applied last, so consumer values can override component defaults. |
| `ref` | `Ref<HTMLElement>` | — | Forwarded to the outer container for focus, measurement, or integration with other libraries. |

All standard HTML attributes—including `id`, `title`, `dir`, `lang`, `role`, `data-*`, `aria-*`, and event handlers—are forwarded to the outer element.

## Behavior and constraints

- A finite width is required. The width can come from the component, its parent, flexbox, or grid.
- The default one-line and multiline paths use native CSS and do not repeatedly measure text.
- Custom ellipsis content and browsers without multiline clamp use DOM measurement with binary search.
- Text is recalculated when its container resizes and after document fonts finish loading.
- The JavaScript fallback supports plain strings, not nested JSX markup.
- Consumer `style` values intentionally override the built-in truncation styles. Avoid overriding `overflow`, `white-space`, `text-overflow`, `display`, or `-webkit-line-clamp` unless you want to change the truncation behavior.

## Browser compatibility

The package uses capability detection instead of browser sniffing:

- no `ResizeObserver`: falls back to the window `resize` event;
- no `Intl.Segmenter`: falls back to Unicode code-point splitting;
- no native multiline clamp: falls back to DOM measurement;
- server rendering: renders safely and measures after hydration.

The source component has been QA-tested in production on older iOS Safari and Chrome versions. Exact browser-version guarantees should follow the compatibility matrix of your React application; please include the browser and OS version when reporting a compatibility issue.

## Contributing

Issues and pull requests are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for setup, test expectations, and guidance for browser-specific reports.

## License

[MIT](LICENSE) © 2026 Sobhan Yazdanjoo
