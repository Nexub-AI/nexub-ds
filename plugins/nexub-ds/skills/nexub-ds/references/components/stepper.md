# Stepper

Progress through a multi-step flow, with clickable steps that follow the order you allow.

- Package: `@nexub/react` · Category: Navigation · Status: beta
- Import: `import { Stepper } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/stepper

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` (required) | `{ id, label, description? }[]` |  | The steps in order. |
| `current` (required) | `number` |  | Index of the step being shown. |
| `completed` | `number[]` |  | Finished steps. Defaults to every step before `current`. |
| `onStepChange` | `(index) => void` |  | Makes reachable steps buttons: finished ones and the first unfinished one. |
| `nonLinear` | `boolean` |  | Every step is reachable. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Vertical suits side columns and narrow screens. |
| `aria-label` | `string` |  | Names the navigation landmark, e.g. "Setup steps". |

## Example: Wizard with a form per step

```tsx
'use client';

import * as React from 'react';
import { Button, Form, FormField, Input, Stepper } from '@nexub/react';

const steps = [
  { id: 'account', label: 'Account' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'done', label: 'Done' },
];

export default function Example() {
  const [current, setCurrent] = React.useState(0);
  return (
    <div className="flex w-full max-w-lg flex-col gap-6">
      <Stepper aria-label="Sign-up steps" steps={steps} current={current} onStepChange={setCurrent} />
      {current < 2 ? (
        <Form key={current} onSubmit={() => setCurrent(current + 1)}>
          <FormField.Root name={current === 0 ? 'email' : 'workspace'} required>
            <FormField.Label>{current === 0 ? 'Work email' : 'Workspace name'}</FormField.Label>
            <FormField.Control>
              <Input type={current === 0 ? 'email' : 'text'} />
            </FormField.Control>
            <FormField.Error />
          </FormField.Root>
          <Button type="submit" className="self-start">Continue</Button>
        </Form>
      ) : (
        <p className="text-body-md">All set.</p>
      )}
    </div>
  );
}
```

## Accessibility

- A `nav` with an ordered list; the current step has `aria-current="step"`.
- Each step reads "Step 2 of 4: Billing", plus "completed" when finished.
- Validate each step with a Form and move `current` on its submit.

Related: [form](form.md), [tabs](tabs.md)
