# Error Summary

Lists a form’s errors after a failed submit, with a link to each field. useFormErrors wires the fields to their messages.

- Package: `@nexub/patterns` · Category: Forms · Status: beta
- Import: `import { ErrorSummary } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/error-summary

## When to use

- Forms validated on submit, especially long ones where some errors are off screen.
- Alongside inline messages, never instead of them.

## When not to use

- Live validation while typing: pass a new array per submit, not per keystroke, or the summary steals focus.
- A single field: the inline message is enough.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `errors` (required) | `{ id: string; message: string }[]` |  | One entry per invalid field; `id` is the field’s DOM id. Renders nothing when empty. |
| `title` | `ReactNode` | `'There is a problem'` | Heading; it also labels the summary. |
| `onFocusField` | `(id: string) => void` |  | Called after a link moves focus to its field. |
| `useFormErrors(map)` (required) | `Record<string, string \| null \| undefined \| false>` |  | Takes `{ fieldId: message }`. Falsy messages are skipped. |
| `→ errors` | `ErrorSummaryItem[]` |  | The list for `ErrorSummary`. Stable for the same map object. |
| `→ fieldProps(id)` | `function` |  | Spread on the input: `id`, plus `aria-invalid` and `aria-describedby="${id}-error"` when it has an error. |
| `→ errorProps(id)` | `function` |  | Spread on the inline message: `id="${id}-error"`, the same id FormField.Error uses. |

## Example: Validate on submit

Submit empty to see the summary. A new map per submit moves focus to the summary; links jump to each field.

```tsx
function SignUp() {
  const [submitted, setSubmitted] = React.useState<FormErrorMap>({});
  const { errors, fieldProps, errorProps } = useFormErrors(submitted);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setSubmitted({
      name: String(data.get('name')).trim() ? undefined : 'Enter your name',
      email: /^\S+@\S+\.\S+$/.test(String(data.get('email'))) ? undefined : 'Enter an email address, like name@example.com',
    });
  }

  return (
    <form noValidate onSubmit={submit}>
      <ErrorSummary errors={errors} />
      <Label htmlFor="name">Name</Label>
      <Input name="name" {...fieldProps('name')} invalid={Boolean(submitted.name)} />
      {submitted.name && <FormError {...errorProps('name')}>{submitted.name}</FormError>}
      <Label htmlFor="email">Email</Label>
      <Input name="email" type="email" {...fieldProps('email')} invalid={Boolean(submitted.email)} />
      {submitted.email && <FormError {...errorProps('email')}>{submitted.email}</FormError>}
      <Button type="submit">Create account</Button>
    </form>
  );
}
```

## Accessibility

- Roles: alert
- Takes focus whenever it receives a new, non-empty `errors` array, so screen readers read it and keyboard users start from it.
- Each link scrolls its field into view and focuses it.
- An `alert` labelled by its heading. Fields get `aria-invalid` and `aria-describedby` pointing at their inline message.

Related: [form-field](form-field.md), [input](input.md), [alert](alert.md)
