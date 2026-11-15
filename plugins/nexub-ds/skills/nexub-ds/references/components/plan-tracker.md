# Plan Tracker

An agent plan: ordered steps with done, active, pending or failed status.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { PlanTracker } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/plan-tracker

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `steps` (required) | `{ title; status; detail? }[]` |  | Status is done, active, pending or failed. |

## Example: Agent plan

```tsx
import { PlanTracker } from '@nexub/react';

export default function Example() {
  return (
    <PlanTracker
      steps={[
        { title: 'Read October invoices', status: 'done', detail: '42 invoices' },
        { title: 'Match payments to invoices', status: 'active', detail: '31 of 42 matched' },
        { title: 'Draft reminders for the unpaid ones', status: 'pending' },
        { title: 'Ask you before sending', status: 'pending' },
      ]}
    />
  );
}
```

## Accessibility

- Each step reads its status in text; the active step has `aria-current="step"`.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md)
