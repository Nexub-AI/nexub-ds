# Alert

Inline contextual message with optional title, icon, and dismiss action.

- Package: `@nexub/react` · Category: Feedback · Status: stable
- Import: `import { Alert } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/alert

## When to use

- Communicating system status, errors, or success after an action
- Showing inline validation feedback inside a form
- Warning the user about a potentially risky operation
- Providing contextual information relevant to the current page

## When not to use

- Transient messages — use Toast for ephemeral notifications
- Blocking the user for a required decision — use AlertDialog
- Marketing or promotional messaging
- Replacing empty states — use EmptyState instead

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Semantic colour tone of the alert. |
| `title` | `string` |  | Bold title rendered at the top of the alert. |
| `icon` | `ReactNode` |  | Custom icon rendered to the left of the content. |
| `action` | `ReactNode` |  | Action element (e.g. a button) rendered beside the content. |
| `onClose` | `() => void` |  | When provided, renders a close button that calls this handler. |

## Example: Default

```tsx
<Alert tone="info" title="Heads up">Your trial expires in 3 days.</Alert>
```

## Example: Tones

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
  <Alert tone="info" title="Information">This is an informational message.</Alert>
  <Alert tone="success" title="Success">Your changes have been saved.</Alert>
  <Alert tone="warning" title="Warning">Please review before proceeding.</Alert>
  <Alert tone="danger" title="Error">Something went wrong. Please try again.</Alert>
</div>
```

## Example: Dismissible

```tsx
<Alert tone="success" title="Saved" onClose={() => {}}>Your changes have been saved.</Alert>
```
