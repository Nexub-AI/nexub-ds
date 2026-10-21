# Streaming Text

Assistant text as it arrives: new chunks fade in, text already shown stays still, and a caret marks the end.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { StreamingText } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/streaming-text

## When to use

- Any model output rendered token by token.

## When not to use

- Finished text loaded from history: render it as plain text, or with `streaming={false}`.
- Model output as HTML or Markdown HTML: StreamingText renders text only. Parse Markdown to React elements yourself; never inject model HTML.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `text` (required) | `string` |  | The full text received so far. Append to it; anything that is not an append renders statically. |
| `streaming` | `boolean` | `false` | Shows the caret and sets `aria-busy` while more text is expected. |
| `as` | `'div' \| 'p' \| 'span'` | `'div'` | Element to render. |
| `aria-live` | `'off' \| 'polite'` | `'off'` | Opt-in live announcements. Leave off: screen readers would re-read the region on every token. |

## Example: Streaming a reply

Words arrive on a timer. Restart streams the paragraph again.

```tsx
const reply = 'Tokens arrive a few characters at a time. Each new chunk fades in while the text before it stays put, so the eye can keep reading.';
const [length, setLength] = React.useState(0);
const streaming = length < reply.length;

React.useEffect(() => {
  if (!streaming) return;
  const id = setTimeout(() => setLength((n) => Math.min(reply.length, n + 6)), 60);
  return () => clearTimeout(id);
}, [length, streaming]);

<StreamingText as="p" text={reply.slice(0, length)} streaming={streaming} />
<Button variant="outline" size="sm" onClick={() => setLength(0)}>Restart</Button>
```

## Accessibility

- Not a live region by default. Announce the finished message once instead, e.g. through a polite status or Conversation’s `announce` for whole messages.
- `aria-busy` is true while streaming, so assistive tech can wait for the final text.
- The caret is decorative (`aria-hidden`). With reduced motion, chunks appear without fading and the caret does not blink.
- Only the last three chunks keep their own span, so the DOM stays flat however long the reply gets.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md), [conversation](conversation.md)
