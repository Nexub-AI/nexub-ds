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
| `steps[].status` | `'complete' \| 'current' \| 'upcoming' \| 'error' \| 'warning' \| 'skipped' \| 'cancelled'` |  | 11.4: the step's state, named as in StatusSteps; read after the label. Wins over `current` and `completed`. |
| `steps[].description` | `ReactNode` |  | 11.4: any content (a date, a link). |
| `steps[].actions` | `ReactNode` |  | 11.4: actions under the step, e.g. Retry. |

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

## Example: Statuses and actions

For "all done", give every step `status: 'complete'`. 12.0 removed `current={-1}`; `nexub-migrate --rules changes-in-12` rewrites it.

```tsx
import { Button, Stepper } from '@nexub/react';

export default function Example() {
  return (
    <Stepper
      className="w-full"
      current={2}
      steps={[
        { label: 'Details', status: 'complete' },
        { label: 'Identity', status: 'skipped', description: 'Not needed for this plan' },
        { label: 'Bank check', status: 'error', description: 'The bank rejected the account', actions: <Button size="sm" variant="outlined">Retry</Button> },
        { label: 'Payout', status: 'upcoming' },
      ]}
    />
  );
}
```

## Accessibility

- A `nav` with an ordered list; the current step has `aria-current="step"`.
- Each step reads "Step 2 of 4: Billing", plus "completed" when finished.
- Validate each step with a Form and move `current` on its submit.

Related: [form](form.md), [tabs](tabs.md)
