# Floating Input

A text field whose label sits inside and floats up on focus or input. CSS only.

- Package: `@nexub/react` · Category: Forms · Status: beta
- Import: `import { FloatingInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/floating-input

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `string` |  | Always visible: inside the empty field, above the value otherwise. |
| `...input` | `InputHTMLAttributes` |  | Any input attribute except `placeholder`. Set `aria-invalid` for errors. |

## Example: Sign-in form

```tsx
import { Button, FloatingInput } from '@nexub/react';

export default function Example() {
  return (
    <form className="flex w-full max-w-sm flex-col gap-3">
      <FloatingInput label="Email" type="email" autoComplete="email" />
      <FloatingInput label="Password" type="password" autoComplete="current-password" />
      <Button type="submit">Sign in</Button>
    </form>
  );
}
```

## Accessibility

- A real `<label>` tied to the input, so the name never disappears.

Related: [input](input.md), [form-field](form-field.md)
