# Conversation

Chat layout: a scrolling message list that follows new content, with a sticky composer underneath.

- Package: `@nexub/patterns` · Category: AI · Status: beta
- Import: `import { Conversation } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/conversation

## When to use

- A full chat or assistant view: messages above, composer below.

## When not to use

- A single question and answer: a PromptInput and a MessageBubble in normal flow are enough.
- Comment threads that don’t follow new content: use ActivityFeed.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` |  | The messages, usually MessageBubbles. |
| `composer` | `ReactNode` |  | Sticky slot under the list, usually a PromptInput. |
| `autoScroll` | `boolean` | `true` | Follow new content while the reader is at the bottom. Scrolling up stops following and shows "Jump to latest". |
| `announce` | `boolean` | `false` | Make the list a polite `role="log"`. Only for whole-message updates: with token streaming it announces every chunk. |
| `messages` | `Partial<ConversationMessages>` |  | Overrides for `jumpToLatest` and `conversation`. |

## Example: Mini chat

Send a message: it shows Thinking, then streams a cited reply. Stop or Escape ends the reply early.

```tsx
type Message = { id: number; from: 'user' | 'assistant'; text: string };

const REPLY = 'Air-source heat pumps work in most homes and run at roughly the cost of gas.';
const SOURCE = { title: 'Choosing a heat pump', url: 'https://example.com/guides/heat-pumps' };

function Chat() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [status, setStatus] = React.useState<'idle' | 'submitting' | 'streaming'>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

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
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, text: REPLY.slice(0, length) } : msg)));
    if (length >= REPLY.length) return setStatus('idle');
    timer.current = setTimeout(() => stream(id, length + 4), 50);
  }

  function stop() {
    clearTimeout(timer.current);
    setStatus('idle');
  }

  const last = messages[messages.length - 1];

  return (
    <Conversation
      style={{ height: 420 }}
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
                {msg.text === REPLY && <Citation index={1} source={SOURCE} />}
              </>
            )}
          </MessageBubble>
        ),
      )}
    </Conversation>
  );
}
```

## Accessibility

- Roles: region (default) or log (with `announce`)
- `Tab`: The message list is focusable so keyboard users can scroll it.
- Keep focus in the composer while a reply streams; don’t move it to the new message.
- The list is named "Conversation". Leave `announce` off while streaming tokens and announce the finished reply once instead.
- With reduced motion, "Jump to latest" scrolls instantly.

Related: [message-bubble](message-bubble.md), [prompt-input](prompt-input.md), [streaming-text](streaming-text.md)
