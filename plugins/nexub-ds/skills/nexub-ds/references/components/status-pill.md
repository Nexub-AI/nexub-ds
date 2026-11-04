# Status Pill

> **Deprecated.** Do not use in new code. Removal planned in 3.0: use [Badge](badge.md). `<Badge variant="soft" leadingIcon={dot}>` covers it. Deprecated — use Badge. A pill indicator for status values like active, pending, error.

- Package: `@nexub/react` · Category: Labels & Badges · Status: deprecated
- Import: `import { StatusPill } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/status-pill

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Text displayed inside the pill. |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Semantic colour tone of the pill. |
| `dot` | `boolean` | `false` | Renders a small status dot before the label. Pulses automatically for success and info tones. |

## Example: Default

```tsx
import { StatusPill } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <StatusPill tone="success" label="Active" />
      <StatusPill tone="warning" label="Pending" />
      <StatusPill tone="danger" label="Error" />
      <StatusPill tone="neutral" label="Draft" />
      <StatusPill tone="info" label="Syncing" />
    </div>
  );
}
```

## Example: With dot

```tsx
import { StatusPill } from '@nexub/react';

export default function Example() {
  return <StatusPill tone="success" dot label="Live" />;
}
```
