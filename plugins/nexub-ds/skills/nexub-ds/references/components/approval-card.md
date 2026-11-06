# Approval Card

The agent asks before it acts: what will happen, then Approve or Deny.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { ApprovalCard } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/approval-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | What the agent wants to do. |
| `onApprove / onDeny` | `() => void` |  | Called once with the choice. |

## Example: Before sending

```tsx
'use client';

import { ApprovalCard } from '@nexub/react';

export default function Example() {
  return (
    <ApprovalCard title="Send 3 payment reminders to Acme" approveLabel="Send reminders">
      Invoices INV-1042, INV-1051 and INV-1063, $4,120 in total, to ap@acme.example.
    </ApprovalCard>
  );
}
```

## Accessibility

- The outcome is announced in a polite live region and replaces the buttons.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md)
