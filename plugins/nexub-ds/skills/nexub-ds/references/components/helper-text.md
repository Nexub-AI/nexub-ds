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
<HelperText>We will never share your email with anyone else.</HelperText>
```

## Example: Tones

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
  <HelperText tone="info">Your password must be at least 8 characters.</HelperText>
  <HelperText tone="success">Username is available.</HelperText>
  <HelperText tone="warning">This action may affect other records.</HelperText>
  <HelperText tone="danger">This field is required.</HelperText>
</div>
```
