# @sob-hon/react-text-truncate

A private, lightweight React component for responsive single-line and multi-line text truncation.

The component uses native CSS ellipsis and line clamping when possible. It falls back to DOM measurement when a custom ellipsis is supplied or when multi-line clamping is unavailable.

## Installation

Configure the GitHub Packages registry for the `@sob-hon` scope:

```ini
@sob-hon:registry=https://npm.pkg.github.com
```

Authenticate with a GitHub token that has `read:packages`, then install:

```sh
npm install @sob-hon/react-text-truncate
```

Never commit a GitHub token to the repository.

## Usage

```tsx
import Truncate from '@sob-hon/react-text-truncate';

export function ProductTitle({ title }: { title: string }) {
  return <Truncate lines={2}>{title}</Truncate>;
}
```

Use a custom ellipsis:

```tsx
<Truncate lines={3} ellipsis={<span aria-hidden="true">... more</span>}>
  {description}
</Truncate>
```

Choose the rendered HTML element:

```tsx
<Truncate as="p" className="description" lines={3}>
  {description}
</Truncate>
```

## API

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `string` | required | Plain text to display and truncate. |
| `lines` | `number` | `1` | Maximum visible lines. Invalid values fall back to `1`. |
| `ellipsis` | `ReactNode` | native `…` | Custom content displayed when JavaScript truncation occurs. |
| `as` | `'span' \| 'p' \| 'div'` | `'span'` | HTML element rendered by the component. |

Standard HTML attributes, `className`, `style`, ARIA attributes, and refs are forwarded to the rendered element.

The component defaults to `display: block`. Consumer-provided `style` values override its defaults.

## Development

Development requires Node.js 22.13 or newer.

```sh
npm install
npm run check
npm run build
npm pack --dry-run
```

## Publishing

Releases are published privately to GitHub Packages. Create a GitHub release to run the publishing workflow after it has been configured in the repository.
