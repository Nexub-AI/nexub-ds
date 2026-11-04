# Message Bubble

One message in a conversation. User messages sit in a bubble at the end; assistant replies run full width. MessageActions adds copy, feedback and regenerate.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { MessageBubble } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/message-bubble

## When to use

- Each turn in a chat or assistant thread, inside Conversation.
- MessageActions under assistant replies the user may want to copy, rate or retry.

## When not to use

- Comment threads and activity logs: use ActivityFeed or NotificationItem.
- Model output as HTML: render text or React elements as children, never `dangerouslySetInnerHTML`.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `from` (required) | `'user' \| 'assistant' \| 'system'` |  | Who sent it. Sets layout and the default accessible name. |
| `avatar` | `ReactNode` |  | Assistant only: shown at the inline start. |
| `name` | `string` |  | Accessible name of the message. Defaults to "You said" or "Assistant said". |
| `status` | `'sending' \| 'error'` |  | `sending` sets `aria-busy`; `error` shows "Failed to send". |
| `onRetry` | `() => void` |  | With `status="error"`, adds a Retry button. |
| `messages` | `Partial<MessageStrings>` |  | Local string overrides. |
| `MessageActions text` | `string` |  | Text Copy puts on the clipboard. |
| `MessageActions copy` | `boolean` | `true` | Set false to hide Copy. |
| `MessageActions feedback / defaultFeedback / onFeedback` | `'up' \| 'down' \| null` |  | Thumbs up/down appear when `onFeedback` is set. Pressing the active one clears it. |
| `MessageActions onRegenerate` | `() => void` |  | Shows Regenerate when set. |

## Example: Conversation

Hover or focus the assistant reply to show its actions.

```tsx
import { MessageBubble, Avatar, MessageActions, toast } from '@nexub/react';
import { Sparkles } from '@nexub/icons';

export default function Example() {
  return (
    <div className="flex flex-col gap-4 items-stretch w-full max-w-[560px]">
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
    <div className="w-full max-w-[560px]">
      <MessageBubble from="user" status="error" onRetry={() => toast.info('Retrying…')}>
        Can I get a refund for last month?
      </MessageBubble>
    </div>
  );
}
```

## Accessibility

- Roles: article (each message), alert (send error), button (actions)
- `Tab`: Moves through the action buttons; focusing one reveals the row.
- `Space / Enter`: Activates an action. Feedback buttons toggle.
- Each message is an `article` named "You said" or "Assistant said", so users can jump between messages.
- Feedback buttons expose `aria-pressed`. Copy announces "Copied" through a status region.
- The action row is only visually hidden until hover; it stays in the tab order and accessibility tree.

Related: [streaming-text](streaming-text.md), [conversation](conversation.md), [citation](citation.md)
