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
import { Alert } from '@nexub/react';

export default function Example() {
  return <Alert tone="info" title="Heads up">Your trial expires in 3 days.</Alert>;
}
```

## Example: Tones

```tsx
import { Alert } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start w-full max-w-[480px]">
      <Alert tone="info" title="Info">Informational message.</Alert>
      <Alert tone="success" title="Success">Operation completed successfully.</Alert>
      <Alert tone="warning" title="Warning">Something needs your attention.</Alert>
      <Alert tone="danger" title="Error">Something went wrong.</Alert>
    </div>
  );
}
```

## Example: Dismissible

```tsx
import { Alert } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[480px]">
      <Alert tone="success" title="Saved" onClose={() => {}}>Your changes have been saved.</Alert>
    </div>
  );
}
```
