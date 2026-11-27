# Conversation

Chat layout: a scrolling message list that follows new content, with a sticky composer underneath. DateSeparator labels the days between messages.

- Package: `@nexub/patterns` · Category: AI · Status: stable
- Import: `import { Conversation } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/conversation

## When to use

- A full chat or assistant view: messages above, composer below.
- DateSeparator between messages from different days, in any message list.

## When not to use

- A single question and answer: a PromptInput and a MessageBubble in normal flow are enough.
- Comment threads that don’t follow new content: use ActivityFeed.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The messages, usually MessageBubbles. |
| `composer` | `ReactNode` |  | Sticky slot under the list, usually a PromptInput. |
| `autoScroll` | `boolean` | `true` | Follow new content while the reader is at the bottom. Scrolling up stops following and shows "Jump to latest". 12.2: if messages arrive while scrolled up, it reads "Jump to newest" and "New messages" is announced once. |
| `announce` | `boolean` | `false` | Make the list a polite `role="log"`. Only for whole-message updates: with token streaming it announces every chunk. |
| `maxHeight` | `number \| string` |  | 11.5: cap the height so it works in normal flow without a fixed-height parent. It grows with its messages up to this, then the list scrolls and follows. Without it, it fills its parent (`h-full`). |
| `thinking` | `ReactNode` |  | 12.2: slot at the end of the list for a `<ThinkingIndicator />`, in a polite `role="status"` region. It never moves the scroll or counts as a new message. Keep the prop set (`busy ? <ThinkingIndicator /> : null`) so the live region exists before the indicator appears. |
| `messages` | `Partial<ConversationMessages>` |  | Overrides for `jumpToLatest`, `conversation`, and (12.2) `jumpToNewest`, `newMessages`. |
| `DateSeparator date` | `Date \| string \| number` |  | 12.2: the day it starts. Shows "Today", "Yesterday" or a medium date in the provider’s locale ("25 Nov 2026" in en-GB). A date-only string ("2026-11-25") is a local day. |
| `DateSeparator children` | `ReactNode` |  | Replaces the computed label. |
| `DateSeparator now` | `Date \| string \| number` |  | "Now" for the Today / Yesterday check; defaults to the current time. Pass one in tests and stories. |
| `DateSeparator locale` | `string` |  | Overrides the NexubProvider locale for the date. |
| `DateSeparator messages` | `Partial<{ today: string; yesterday: string }>` |  | Local overrides; otherwise `today` / `yesterday` from NexubProvider. |

## Example: Mini chat

Send a message: it shows Thinking, then streams a cited reply. Stop or Escape ends the reply early.

```tsx
import * as React from 'react';
import { type PromptInputStatus, PromptInput, MessageBubble, ThinkingIndicator, StreamingText, Citation, type CitationSource } from '@nexub/react';
import { Conversation } from '@nexub/patterns';

const CITATION_SOURCES: CitationSource[] = [
  { title: 'Choosing a heat pump', url: 'https://example.com/guides/heat-pumps', snippet: 'Air-source pumps suit most homes with a garden or outside wall.' },
  { title: 'Grants for home heating', url: 'https://example.org/grants', domain: 'example.org' },
  { title: 'Running costs compared', url: 'https://example.net/costs' },
];

type ChatMessage = { id: number; from: 'user' | 'assistant'; text: string };

const CHAT_REPLY = 'Air-source heat pumps work in most homes and run at roughly the cost of gas.';

const CHAT_SOURCE = CITATION_SOURCES[0]!;

export default function Example() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [status, setStatus] = React.useState<PromptInputStatus>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  function send(text: string) {
    const id = Date.now();
    setMessages((m) => [...m, { id, from: 'user', text }, { id: id + 1, from: 'assistant', text: '' }]);
    setStatus('submitting');
    timer.current = setTimeout(() => {
      setStatus('streaming');
      stream(id + 1, 0);
    }, 800);
  }

  function stream(id: number, length: number) {
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: CHAT_REPLY.slice(0, length) } : msg)));
    if (length >= CHAT_REPLY.length) return setStatus('idle');
    timer.current = setTimeout(() => stream(id, length + 4), 50);
  }

  function stop() {
    clearTimeout(timer.current);
    setStatus('idle');
  }

  const last = messages[messages.length - 1];

  return (
    <Conversation
      className="h-105 w-full"
      composer={<PromptInput placeholder="Ask about heat pumps" status={status} onSubmit={send} onStop={stop} />}
    >
      {messages.map((msg) =>
        msg.from === 'user' ? (
          <MessageBubble key={msg.id} from="user">{msg.text}</MessageBubble>
        ) : (
          <MessageBubble key={msg.id} from="assistant">
            {status === 'submitting' && msg === last ? (
              <ThinkingIndicator />
            ) : (
              <>
                <StreamingText as="span" text={msg.text} streaming={status === 'streaming' && msg === last} />
                {msg.text === CHAT_REPLY && <Citation index={1} source={CHAT_SOURCE} />}
              </>
            )}
          </MessageBubble>
        ),
      )}
    </Conversation>
  );
}
```

## Example: In normal flow

No fixed-height parent: `maxHeight="20rem"` lets it grow with its messages, then scroll.

```tsx
import * as React from 'react';
import { PromptInput, MessageBubble } from '@nexub/react';
import { Conversation } from '@nexub/patterns';

type ChatMessage = { id: number; from: 'user' | 'other'; text: string };

export default function Example() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 1, from: 'other', text: 'Morning! Did the invoices go out?' },
  ]);
  return (
    <div className="w-full">
      <Conversation
        maxHeight="20rem"
        composer={
          <PromptInput
            placeholder="Reply to Grace"
            onSubmit={(text) => setMessages((m) => [...m, { id: Date.now(), from: 'user', text }])}
          />
        }
      >
        {messages.map((msg) =>
          msg.from === 'other' ? (
            <MessageBubble key={msg.id} from="other" name="Grace Hopper">
              {msg.text}
            </MessageBubble>
          ) : (
            <MessageBubble key={msg.id} from="user">
              {msg.text}
            </MessageBubble>
          ),
        )}
      </Conversation>
    </div>
  );
}
```

## Example: Days and thinking

12.2: a `DateSeparator` wherever the day changes, and a `ThinkingIndicator` in the `thinking` slot while a reply is on its way. Send a message to see it.

```tsx
import * as React from 'react';
import { PromptInput, MessageBubble, ThinkingIndicator } from '@nexub/react';
import { Conversation, DateSeparator } from '@nexub/patterns';

type ChatMessage = { id: number; from: 'user' | 'assistant'; text: string; at: Date };

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);
const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

export default function Example() {
  const [busy, setBusy] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: 1, from: 'user', text: 'Can you total last week’s invoices?', at: daysAgo(3) },
    { id: 2, from: 'assistant', text: 'Twelve invoices, £8,420 in all.', at: daysAgo(3) },
    { id: 3, from: 'user', text: 'Which ones are still unpaid?', at: daysAgo(1) },
    { id: 4, from: 'assistant', text: 'Three: Acme, Globex and Initech.', at: daysAgo(1) },
  ]);
  const send = (text: string) => {
    setMessages((m) => [...m, { id: Date.now(), from: 'user', text, at: new Date() }]);
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now(), from: 'assistant', text: 'On it: reminders drafted.', at: new Date() }]);
      setBusy(false);
    }, 1500);
  };
  return (
    <div className="w-full">
      <Conversation
        maxHeight="24rem"
        thinking={busy ? <ThinkingIndicator /> : null}
        composer={<PromptInput placeholder="Ask about your invoices" onSubmit={send} />}
      >
        {messages.map((msg, i) => (
          <React.Fragment key={msg.id}>
            {(i === 0 || !sameDay(messages[i - 1]!.at, msg.at)) && <DateSeparator date={msg.at} />}
            <MessageBubble from={msg.from}>{msg.text}</MessageBubble>
          </React.Fragment>
        ))}
      </Conversation>
    </div>
  );
}
```

## Accessibility

- Roles: region (default) or log (with `announce`), status (polite) around the `thinking` slot, DateSeparator: plain text, not `role="separator"`
- `Tab`: The message list is focusable so keyboard users can scroll it.
- Keep focus in the composer while a reply streams; don’t move it to the new message.
- The list is named "Conversation". Leave `announce` off while streaming tokens and announce the finished reply once instead.
- With reduced motion, "Jump to latest" scrolls instantly.
- Messages arriving while the reader is scrolled up announce "New messages" once per batch (a hidden polite live region); the batch ends when they are back at the bottom. With `announce` the log speaks instead.
- The `thinking` slot is a polite status, so a ThinkingIndicator placed in it is read once when it appears.
- DateSeparator is read as its text ("Yesterday") in order with the messages. It is not `role="separator"`: a separator’s children are presentational, and screen readers announce a non-focusable one as just "separator" or skip it, which would lose the day. The hairlines are hidden.

Related: [message-bubble](message-bubble.md), [prompt-input](prompt-input.md), [streaming-text](streaming-text.md)
