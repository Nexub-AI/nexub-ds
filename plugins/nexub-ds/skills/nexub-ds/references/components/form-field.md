# Form Field

Wraps Label, Input, HelperText and FormError into a single accessible group.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { FormField } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/form-field

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | Name attribute forwarded to the underlying input. |
| `id` | `string` |  | Explicit id for the input; defaults to the name value. |
| `error` | `string` |  | Validation error message shown below the input. |
| `required` | `boolean` |  | Marks the field as required and renders a required indicator on the label. |

## Example: Default

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '280px' }}>
  <Label htmlFor="field-name" required>Full name</Label>
  <Input id="field-name" placeholder="Jane Smith" />
  <HelperText>Enter your legal name.</HelperText>
</div>
```
