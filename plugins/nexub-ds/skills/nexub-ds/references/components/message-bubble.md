# Message Bubble

One message in a conversation. User messages sit in a bubble at the end; assistant replies run full width. MessageActions adds copy, feedback and regenerate; MessageCard and Highlight structure what a message says.

- Package: `@nexub/react` · Category: AI · Status: stable
- Import: `import { MessageBubble } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/message-bubble

## When to use

- Each turn in a chat or assistant thread, inside Conversation.
- MessageActions under assistant replies the user may want to copy, rate or retry.
- MessageCard for something the user can act on inside a reply: an approval, a record, a booking.
- Highlight for the few values a reader scans for (an amount, a date, a status), not for whole sentences.

## When not to use

- Comment threads and activity logs: use ActivityFeed or NotificationItem.
- Model output as HTML: render text or React elements as children, never `dangerouslySetInnerHTML`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `from` (required) | `'user' \| 'assistant' \| 'system' \| 'other'` |  | Who sent it. Sets layout and the default accessible name. `other` (11.5) is a third party in a group conversation. |
| `avatar` | `ReactNode` |  | Assistant and other: shown at the inline start. User (12.2): at the inline end, with the same size and spacing. |
| `name` | `string` |  | Accessible name of the message. Defaults to "You said" or "Assistant said". With `from="other"` it is also shown as the header. |
| `meta` | `ReactNode` |  | 11.5: header text beside the name, e.g. the time. |
| `status` | `'sending' \| 'error'` |  | `sending` sets `aria-busy`; `error` shows "Failed to send". |
| `onRetry` | `() => void` |  | With `status="error"`, adds a Retry button. |
| `collapse` | `number \| false` | `false` | 12.2: clamp the content to this many lines. Only when it is taller does a "Read more" / "Show less" toggle appear, with a fade at the clamped edge. Keep MessageActions outside a collapsed bubble, or the clamp hides it. |
| `messages` | `Partial<MessageStrings>` |  | Local string overrides, including `readMore`, `showLess`, `showAll` and `moreActions` (12.2). |
| `MessageActions text` | `string` |  | Text Copy puts on the clipboard. |
| `MessageActions copy` | `boolean` | `true` | Set false to hide Copy. |
| `MessageActions feedback / defaultFeedback / onFeedback` | `'up' \| 'down' \| null` |  | Thumbs up/down appear when `onFeedback` is set. Pressing the active one clears it. |
| `MessageActions onRegenerate` | `() => void` |  | Shows Regenerate when set. |
| `MessageActions actions` | `{ label: string; icon: ReactNode; onSelect: () => void; disabled?: boolean }[]` |  | 11.5: your own icon buttons after the built-in ones. `children` render after these. |
| `MessageCard title / status` | `ReactNode` |  | 12.2 (beta): a bordered block inside a bubble. The title, and a status beside it (usually a `Badge`). |
| `MessageCard fields` | `{ label: ReactNode; value: ReactNode }[]` |  | Label and value pairs as a `dl`: two columns, one when the card is narrow (container query). |
| `MessageCard body` | `ReactNode` |  | Free content under the fields. |
| `MessageCard actions` | `{ label: string; onSelect: () => void; variant?: 'filled' \| 'tonal' \| 'text'; icon?: ReactNode; disabled?: boolean }[] \| ReactNode` |  | At most one `filled` button (the first asked for, or else the first without a variant); the rest are `tonal` or `text`. Past two, the extras go into a "More actions" menu. Any other node renders as given. Warns in development for more than one `filled`. |
| `MessageCard maxHeight` | `number \| string` |  | Clip the fields and body to this height (a number is px), with a "Show all" toggle when they are taller. |
| `MessageCard done` | `ReactNode` |  | Replaces the actions with one line and a `SuccessCheck`, e.g. "Approved by you · 2:14 pm". Announced politely. |
| `Highlight tone` | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'neutral'` | 12.2 (beta): an amount, date or status picked out in running text, on its tone's container colours (AA in both themes). |

## Example: Conversation

Hover or focus the assistant reply to show its actions.

```tsx
import { MessageBubble, Avatar, MessageActions, toast } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch w-full max-w-140">
      <MessageBubble from="user">How do I cancel my subscription?</MessageBubble>
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>Open Settings, then Billing, and choose Cancel plan. You keep access until the end of the billing period.</p>
        <MessageActions
          text="Open Settings, then Billing, and choose Cancel plan."
          onFeedback={() => {}}
          onRegenerate={() => toast.info('Regenerating…')}
        />
      </MessageBubble>
      <MessageBubble from="system">Conversation moved to Billing support</MessageBubble>
    </div>
  );
}
```

## Example: Failed to send

```tsx
import { MessageBubble, toast } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-140">
      <MessageBubble from="user" status="error" onRetry={() => toast.info('Retrying…')}>
        Can I get a refund for last month?
      </MessageBubble>
    </div>
  );
}
```

## Example: Group thread

A third party with a name and time header, and a custom Pin action.

```tsx
import { MessageBubble, Avatar, MessageActions, toast } from '@nexub/react';
import { Pin, Sparkles } from '@nexub/icons';

const REPLY = 'I moved the review to Thursday at 10:00 and told the team.';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch w-full max-w-140">
      <MessageBubble from="other" name="Ada Lovelace" meta="09:40" avatar={<Avatar size="sm" fallback="AL" />}>
        Can we move the review to Thursday?
      </MessageBubble>
      <MessageBubble from="user" meta="09:41">
        Thursday works for me.
      </MessageBubble>
      <MessageBubble from="assistant" meta="09:41" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>{REPLY}</p>
        <MessageActions
          text={REPLY}
          actions={[{ label: 'Pin to thread', icon: <Pin size="sm" aria-hidden="true" />, onSelect: () => toast.info('Pinned') }]}
        />
      </MessageBubble>
    </div>
  );
}
```

## Example: Your avatar and long messages

12.2: `avatar` on your own messages sits at the inline end. `collapse={3}` clamps a long message with a Read more toggle; a short one gets none.

```tsx
import { MessageBubble, Avatar } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

const OUTLINE =
  'Here is the outline. 1. Revenue summary: totals by region, with the quarter-on-quarter change. 2. Costs against the budget. 3. Churn: the rates, the reasons customers gave and what we changed. 4. Hiring plan: open roles by team and the budget impact. 5. Risks and asks for the board.';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch w-full max-w-140">
      <MessageBubble from="user" avatar={<Avatar size="sm" fallback="SL" />}>
        Can you outline the quarterly report for me?
      </MessageBubble>
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />} collapse={3}>
        <p className="m-0">{OUTLINE}</p>
      </MessageBubble>
    </div>
  );
}
```

## Example: MessageCard

12.2 (beta): a request inside a reply, with a status, fields and actions. Approve to see the done line; the third action goes into the More actions menu.

```tsx
import * as React from 'react';
import { MessageBubble, MessageCard, Avatar, Badge, toast } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  const [done, setDone] = React.useState<string>();
  return (
    <div className="w-full max-w-140">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>Ada sent an expense report for your approval.</p>
        <MessageCard
          title="Expense report"
          status={
            <Badge variant="soft" tone={done ? 'success' : 'warning'}>
              {done ? 'Approved' : 'Pending'}
            </Badge>
          }
          fields={[
            { label: 'Amount', value: '€1,240.00' },
            { label: 'Vendor', value: 'Acme GmbH' },
            { label: 'Submitted by', value: 'Ada Lovelace' },
            { label: 'Due', value: '28 Nov 2026' },
          ]}
          body="Team offsite, Berlin. Receipts attached."
          done={done}
          actions={[
            { label: 'Approve', onSelect: () => setDone('Approved by you · 2:14 pm') },
            { label: 'Reject', onSelect: () => toast.info('Rejected') },
            { label: 'Ask a question', onSelect: () => toast.info('Question sent') },
          ]}
        />
      </MessageBubble>
    </div>
  );
}
```

## Example: Highlight

12.2 (beta): amounts, dates and statuses in running text. A plain span, not `<mark>`, so screen readers do not announce a search highlight.

```tsx
import { MessageBubble, Highlight, Avatar } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  return (
    <div className="w-full max-w-140">
      <MessageBubble from="assistant" avatar={<Avatar size="sm" fallback={<Sparkles />} />}>
        <p>
          The invoice for <Highlight tone="primary">€1,240.00</Highlight> is due on <Highlight>28 Nov 2026</Highlight>.
          Payment is <Highlight tone="success">confirmed</Highlight>, the receipt is{' '}
          <Highlight tone="warning">missing</Highlight> and the refund <Highlight tone="error">failed</Highlight>.
        </p>
      </MessageBubble>
    </div>
  );
}
```

## Accessibility

- Roles: article (each message), alert (send error), button (actions, Read more, Show all), menu (MessageCard extra actions), status (MessageCard done line)
- `Tab`: Moves through the action buttons; focusing one reveals the row.
- `Space / Enter`: Activates an action. Feedback buttons toggle.
- `Arrow keys / Escape`: In the MessageCard "More actions" menu: move between items; Escape closes it and returns focus.
- Each message is an `article` named "You said" or "Assistant said", so users can jump between messages.
- Feedback buttons expose `aria-pressed`. Copy announces "Copied" through a status region.
- The action row is only visually hidden until hover; it stays in the tab order and accessibility tree.
- Your own message keeps the name "You said" with an avatar; the avatar adds nothing to it.
- The collapse toggle is a button with `aria-expanded` and `aria-controls` pointing at the content. The clamped text stays in the accessibility tree.
- MessageCard fields are a description list, read as term and value pairs. The overflow button is named "More actions" and opens a menu.
- Highlight is a plain span: its text is read as part of the sentence. Say any meaning the colour adds in words.

Related: [streaming-text](streaming-text.md), [conversation](conversation.md), [citation](citation.md)
