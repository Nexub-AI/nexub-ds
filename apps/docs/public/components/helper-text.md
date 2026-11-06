# Helper Text

Small supporting text placed beneath a form field to provide hints or validation feedback.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { HelperText } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/helper-text

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `'neutral' \| 'info' \| 'success' \| 'warning' \| 'danger'` | `'neutral'` | Semantic colour tone of the helper text. |
| `disabled` | `boolean` |  | Applies muted disabled styling. |

## Example: Default

```tsx
import { HelperText } from '@nexub/react';

export default function Example() {
  return <HelperText>We will never share your email with anyone else.</HelperText>;
}
```

## Example: Tones

```tsx
import { HelperText } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <HelperText tone="info">Sync runs every 10 minutes.</HelperText>
      <HelperText tone="success">Your account is verified.</HelperText>
      <HelperText tone="warning">This action cannot be reversed.</HelperText>
      <HelperText tone="danger">Required field is missing.</HelperText>
    </div>
  );
}
```
