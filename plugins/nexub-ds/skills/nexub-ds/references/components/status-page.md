# StatusPage

A whole page for one state: not found, server error, maintenance, offline or no access.

- Package: `@nexub/patterns` · Category: Feedback · Status: alpha
- Import: `import { StatusPage } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/status-page

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `kind` (required) | `'notFound' \| 'serverError' \| 'maintenance' \| 'offline' \| 'noAccess'` |  | Which state. Sets the default text and illustration. `serverError` and `offline` are announced as alerts. |
| `title` | `React.ReactNode` |  | Overrides the localised title (the one h1). |
| `description` | `React.ReactNode` |  | Overrides the localised description. |
| `code` | `string` |  | A small line above the title, e.g. "404". |
| `actions` | `React.ReactNode` |  | Buttons under the text. Replaces the default Retry or Back to home. |
| `illustration` | `React.ReactNode` |  | Art above the text. Defaults to the Illustration for the kind; `null` hides it. |
| `onRetry` | `() => void` |  | Shows a Retry button for `serverError` and `offline`. |
| `homeHref` | `string` |  | Shows a "Back to home" link for `notFound` and `noAccess`. |
| `fullScreen` | `boolean` | `false` | At least as tall as the viewport. |
| `as` | `'main' \| 'div' \| 'section'` | `'main'` | Landmark element. Use `div` inside an app shell that already renders `<main>`. |

## Example: Not found

```tsx
import { StatusPage } from '@nexub/patterns';

export default function Example() {
  return <StatusPage as="div" kind="notFound" code="404" homeHref="/" />;
}
```

## Example: Server error with Retry

```tsx
import { StatusPage } from '@nexub/patterns';

// Call your data layer's refetch here.
const retry = () => {};

export default function Example() {
  return <StatusPage as="div" kind="serverError" code="500" onRetry={retry} />;
}
```
