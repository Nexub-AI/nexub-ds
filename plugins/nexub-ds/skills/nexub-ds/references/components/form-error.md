# Form Error

An error message with an alert icon, announced when it appears.

- Package: `@nexub/react` · Category: Form & Input · Status: stable
- Import: `import { FormError } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/form-error

## When to use

- A validation message under a field you lay out yourself

## When not to use

- Inside `FormField.Root`: use `FormField.Error`, which wires the ids for you
- Errors for a whole form: use the Error Summary pattern

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The message: say what went wrong and how to fix it. |
| `id` | `string` |  | Point the control at it with `aria-describedby` so the message is read with the field. |

## Example: Under a field

```tsx
import { FormError, Input, Label } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-[280px] flex-col gap-1">
      <Label htmlFor="fe-email">Email</Label>
      <Input id="fe-email" type="email" defaultValue="jane@" aria-invalid aria-describedby="fe-email-error" />
      <FormError id="fe-email-error">Enter an email address like name@example.com.</FormError>
    </div>
  );
}
```

## Accessibility

- Roles: alert
- Has `role="alert"`, so it is announced when rendered. Render it only when there is an error.

Related: [form-field](form-field.md), [helper-text](helper-text.md)
