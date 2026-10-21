# Password Input

A password field with a built-in toggle to reveal or hide the entered value.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { PasswordInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/password-input

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` |  | Placeholder text shown when the field is empty. |
| `invalid` | `boolean` |  | Applies error styling to indicate a validation failure. |
| `disabled` | `boolean` |  | Disables the input. |
| `size` | `'sm' \| 'md' \| 'lg'` |  | Controls font size and padding. |

## Example: Default

```tsx
<PasswordInput placeholder="Enter password…" />
```

## Example: Invalid

```tsx
<PasswordInput invalid placeholder="Password is too short" />
```
