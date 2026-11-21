# Checkbox Field

A Checkbox with its label, description, aside and error; CheckboxGroupField puts several under one question.

- Package: `@nexub/react` · Category: Form Controls · Status: alpha
- Import: `import { CheckboxField } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/checkbox-field

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` (required) | `ReactNode` |  | Names the box; clicking it toggles. |
| `description / error` | `ReactNode` |  | Help under the label and the error under the row. |
| `aside` | `ReactNode` |  | At the row end: a price, a count. |
| `checked` | `boolean \| 'indeterminate'` |  | As Checkbox; `indeterminate` for a parent of a partly picked list. |
| `CheckboxGroupField options` | `{ value, label, description?, disabled? }[]` |  | The choices, with `value` / `onValueChange` (string[]), `orientation`, `required`, `name` and one `error` for the group. |

## Example: Field

```tsx
import { CheckboxField } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <CheckboxField label="Gift wrap" description="Paper and ribbon" aside="$4.00" />
      <CheckboxField label="All invoices" checked="indeterminate" />
      <CheckboxField label="I accept the terms" error="Accept the terms to continue" />
    </div>
  );
}
```

## Example: Group

```tsx
import * as React from 'react';
import { CheckboxGroupField } from '@nexub/react';

export default function Example() {
  const [value, setValue] = React.useState<string[]>(['email']);
  return (
    <CheckboxGroupField
      label="Notify me by"
      description="Pick one or more"
      required
      options={[
        { value: 'email', label: 'Email' },
        { value: 'sms', label: 'SMS', description: 'Carrier rates apply' },
        { value: 'push', label: 'Push', disabled: true },
      ]}
      value={value}
      onValueChange={setValue}
      error={value.length ? undefined : 'Pick at least one'}
    />
  );
}
```

## Accessibility

- CheckboxGroupField is a `fieldset` named by its legend; its error describes the group and marks every box invalid.

Related: [checkbox](checkbox.md), [switch-field](switch-field.md), [checkbox-card](checkbox-card.md), [fieldset](fieldset.md)
