# Logo

The Nexub mark and wordmark, with an optional product name.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { Logo } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/logo

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'full' \| 'icon' \| 'mark'` |  | `full` = mark and wordmark; `icon` = the mark only. `mark` is the old name for `icon`. |
| `product` | `string` |  | Product name after the wordmark, e.g. "Command Hub". Truncates in a narrow container. Ignored for `icon`. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Height: 24, 32 or 40 px. |
| `tone` | `'default' \| 'inverse'` |  | `inverse` is always white, for dark backgrounds or imagery in either theme. |
| `mark` | `'color' \| 'mono'` |  | `color` = the official mark in brand colours; `mono` = `currentColor`. |

## Example: Variants

```tsx
import { Logo } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Logo />
      <Logo variant="icon" />
      <Logo mark="mono" />
      <span className="rounded-shape-container bg-[var(--color-inverse-surface)] p-3">
        <Logo tone="inverse" />
      </span>
    </div>
  );
}
```

## Example: With a product name

```tsx
import { Logo } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-4">
      <Logo product="Command Hub" size="sm" />
      <Logo product="Command Hub" />
      <Logo product="Command Hub" size="lg" />
    </div>
  );
}
```

## Accessibility

- Roles: img
- Read as "Nexub", or "Nexub Command Hub" with `product`.

Related: [top-nav](top-nav.md), [sidebar](sidebar.md)
