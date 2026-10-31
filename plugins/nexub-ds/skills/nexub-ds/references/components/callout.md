# Callout

> **Deprecated.** Do not use in new code. Removal planned in 3.0: use [Alert](alert.md). `<Alert>` covers tone and icon. Deprecated — use Alert. Highlighted content block for tips, warnings, or notes.

- Package: `@nexub/react` · Category: Feedback · Status: deprecated
- Import: `import { Callout } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/callout

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | Semantic colour tone of the callout. |
| `title` | `string` |  | Bold title rendered at the top of the callout. |
| `icon` | `ReactNode` |  | Custom icon rendered beside the title. |

## Example: Default

```tsx
<Callout tone="warning" title="Before you continue">Deleting this record is permanent and cannot be undone.</Callout>
```

## Example: Info

```tsx
<Callout tone="info">Use token names instead of raw hex values for consistent theming.</Callout>
```
