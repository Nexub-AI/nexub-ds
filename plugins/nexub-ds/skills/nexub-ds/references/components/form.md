# Form

Validates on submit with the browser’s own checks plus yours, shows each message on its FormField and focuses the first invalid field.

- Package: `@nexub/react` · Category: Form & Input · Status: beta
- Import: `import { Form } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/form

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onSubmit` | `(data: FormData, event) => void \| Promise` |  | Runs only when every field is valid. Return a promise to mark the form busy (`aria-busy`, `useForm().submitting`) until it settles. |
| `validate` | `(data: FormData) => Record<string, string \| false \| null \| undefined>` |  | Checks the browser can’t do (cross-field rules, a zod schema, a server answer). Keys are field names; empty values mean valid. |
| `onInvalidSubmit` | `(errors: FormErrorItem[]) => void` |  | Errors in field order after a failed submit, ready for ErrorSummary. |
| `useForm()` | `{ errors, submitting } \| null` |  | Reads the closest Form’s state, for a submit button or a custom field. |

## Example: Native validation plus a custom rule

```tsx
'use client';

import * as React from 'react';
import { Button, Form, FormField, Input, useForm } from '@nexub/react';

function Submit() {
  const submitting = useForm()?.submitting;
  return (
    <Button type="submit" className="self-start" disabled={submitting}>
      {submitting ? 'Inviting…' : 'Send invite'}
    </Button>
  );
}

export default function Example() {
  const [sent, setSent] = React.useState('');
  return (
    <Form
      className="w-full max-w-sm"
      validate={(data) => ({
        email: String(data.get('email')).endsWith('@example.com') && 'Use a work address, not example.com',
      })}
      onSubmit={async (data) => {
        await new Promise((r) => setTimeout(r, 600));
        setSent(`Invite sent to ${data.get('email')}`);
      }}
    >
      <FormField.Root name="email" required>
        <FormField.Label>Email</FormField.Label>
        <FormField.Control>
          <Input type="email" autoComplete="email" />
        </FormField.Control>
        <FormField.Error />
      </FormField.Root>
      <Submit />
      <p aria-live="polite" className="text-body-sm text-[var(--color-on-surface-muted)]">{sent}</p>
    </Form>
  );
}
```

## Accessibility

- `Enter`: Submits from any text field; the first invalid field takes focus.
- Messages come from the browser’s constraint validation (`required`, `type="email"`, `pattern`, `min`…), so they are already in the reader’s language.
- FormField.Root with the same `name` picks the message up: the control gets `aria-invalid` and `aria-describedby`, and FormField.Error shows the text.
- A field’s error clears as soon as it is edited; the rest stay until the next submit.
- For long forms, render ErrorSummary (@nexub/patterns) from `onInvalidSubmit`.

Related: [form-field](form-field.md), [fieldset](fieldset.md)
