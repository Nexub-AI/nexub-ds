# Banner

> **Deprecated.** Do not use in new code. Deprecated — use Alert. Full-width announcement banner, typically used at the top of a page.

- Package: `@nexub/react` · Category: Feedback · Status: deprecated
- Import: `import { Banner } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/banner

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` |  | Semantic colour tone of the banner. |
| `action` | `ReactNode` |  | Action element (e.g. a button or link) rendered to the right of the content. |
| `onClose` | `() => void` |  | When provided, renders a close button that dismisses the banner. |

## Example: Default

```tsx
<Banner tone="info">New features available — <strong>see what's new</strong></Banner>
```

## Example: With action

```tsx
<Banner
  tone="warning"
  action={<Button size="sm" variant="outline">View details</Button>}
>
  Your subscription renews in 5 days.
</Banner>
```
