# Badge

Small status indicator or label. Communicates state, category, or count.

- Package: `@nexub/react` · Category: Labels & Badges · Status: stable
- Import: `import { Badge } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/badge

## When to use

- Labelling a status, category, or tag on an item
- Showing a count or numeric indicator alongside an element
- Highlighting new, featured, or updated content
- Communicating a stage in a workflow (draft, published, archived)

## When not to use

- Interactive filtering — use FilterChip or Chip instead
- Long text labels that exceed 2–3 words
- Critical alerts requiring user action — use Alert or Toast
- Replacing a button — badges are non-interactive by design

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `'solid' \| 'soft' \| 'outline'` | `'solid'` | Visual fill style. |
| `tone` | `'success' \| 'danger' \| 'warning' \| 'info' \| 'neutral'` | `'neutral'` | Semantic color tone. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size. |
| `leadingIcon` | `React.ReactNode` |  | Icon or dot rendered before the label. |

## Example: Tones

```tsx
import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Badge tone="success">Active</Badge>
      <Badge tone="danger">Error</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="info">Info</Badge>
      <Badge tone="neutral">Draft</Badge>
    </div>
  );
}
```

## Example: Variants

```tsx
import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Badge variant="solid" tone="success">Solid</Badge>
      <Badge variant="soft" tone="info">Soft</Badge>
      <Badge variant="outline" tone="warning">Outline</Badge>
    </div>
  );
}
```

## Example: With leading dot

```tsx
import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {(['success', 'danger', 'warning'] as const).map((t) => (
        <Badge key={t} tone={t} leadingIcon={<span className="w-[6px] h-[6px] rounded-full bg-current inline-block" />}>
          {t === 'success' ? 'Online' : t === 'danger' ? 'Offline' : 'Away'}
        </Badge>
      ))}
    </div>
  );
}
```

## Accessibility

- Roles: status (when conveying live state)
- `—`: Badges are non-interactive and have no keyboard handlers.
- Skipped in tab order. Decorative — never trap focus on a Badge.
- Reads as inline text. For live status changes, wrap in an element with `role="status"` and `aria-live="polite"`.
- For interactive equivalents (filtering, dismissing) reach for `Chip` or `FilterChip`.

Related: [chip](chip.md)
