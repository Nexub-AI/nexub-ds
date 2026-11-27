# Approval Card

The agent asks before it acts: what will happen, then Approve or Deny.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { ApprovalCard } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/approval-card

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` (required) | `string` |  | What the agent wants to do. |
| `onApprove / onDeny` | `() => void \| Promise` |  | Called once with the choice. Return a promise to show the pending state until it settles (12.4). |
| `args` | `unknown` |  | The action’s arguments, shown as JSON (12.4). |
| `onEdit` | `(args: string) => void \| Promise` |  | Adds Edit: the user edits `args`, then approves with changes; called with the edited text (12.4). |
| `outcome` | `'approved' \| 'edited' \| 'denied' \| null` |  | Controlled outcome; `null` keeps the choice open (12.4). |
| `pending` | `boolean` |  | The action is running: buttons disabled, "Working…" announced (12.4). |

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

## Example: Edit before approving

With `args` and `onEdit` the user can approve, edit the arguments then approve, or deny. A promise from the callback shows the pending state.

```tsx
'use client';

import { ApprovalCard } from '@nexub/react';

export default function Example() {
  return (
    <ApprovalCard
      title="Send a payment reminder"
      args={{ to: 'ap@acme.example', amount: 4120, currency: 'USD' }}
      onEdit={() => new Promise((resolve) => setTimeout(resolve, 1000))}
      onApprove={() => new Promise((resolve) => setTimeout(resolve, 1000))}
    >
      The agent will email Acme&apos;s billing contact.
    </ApprovalCard>
  );
}
```

## Accessibility

- Edit moves focus to the arguments field; Cancel returns it to Edit. Once the choice resolves, focus moves to the card, so it is never lost with the buttons.
- The outcome ("Approved", "Approved with changes", "Denied") and "Working…" are announced in a polite live region; the card is a group named by its title.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md), [diff-view](diff-view.md)
