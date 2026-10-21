# Link

Styled anchor link with variant and external support.

- Package: `@nexub/react` · Category: Inline Primitives · Status: stable
- Import: `import { Link } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/link

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'muted' \| 'underline'` |  | Visual style of the link. |
| `external` | `boolean` |  | Opens the link in a new tab with appropriate rel attributes. |
| `href` | `string` |  | The URL the link points to. |
| `asChild` | `boolean` |  | Merges props onto the immediate child element (Radix Slot). |

## Example: Default

```tsx
<Link href="#">View documentation</Link>
```

## Example: Variants

```tsx
<div style={{ display: 'flex', gap: '16px' }}>
  <Link href="#" variant="default">Default</Link>
  <Link href="#" variant="muted">Muted</Link>
  <Link href="#" variant="underline">Underline</Link>
</div>
```

## Example: External

```tsx
<Link href="#" external>Open in new tab</Link>
```
