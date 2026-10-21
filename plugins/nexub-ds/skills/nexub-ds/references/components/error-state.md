# Error State

Full-page or section error view with retry action.

- Package: `@nexub/react` · Category: Data Display · Status: stable
- Import: `import { ErrorState } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/error-state

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | Primary error heading shown to the user. |
| `description` | `string` |  | Supporting text with more detail about the error or recovery steps. |
| `tone` | `'error' \| 'warning' \| 'info'` | `'error'` | Controls the icon and colour scheme of the error state. |
| `onRetry` | `() => void` |  | When provided, renders a "Try again" button that calls this function on click. |
| `actions` | `React.ReactNode` |  | Custom action elements rendered below the description. Takes priority over the default retry button. |

## Example: Default

```tsx
<ErrorState
  title="Something went wrong"
  description="We could not load the data. Please try again."
  onRetry={() => {}}
/>
```

## Example: Warning

```tsx
<ErrorState
  tone="warning"
  title="Connection issue"
  description="Check your network and try again."
/>
```
