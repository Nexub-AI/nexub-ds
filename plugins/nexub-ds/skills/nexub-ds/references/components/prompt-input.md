# Prompt Input

The composer for a chat: an auto-growing text field with Send, which turns into Stop while a reply streams.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { PromptInput } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/prompt-input

## When to use

- The message box of a chat or assistant.
- Any free-text prompt that starts a long-running, stoppable generation.

## When not to use

- Ordinary forms: use Textarea, where Enter adds a line.
- Search: use SearchInput.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value / defaultValue / onValueChange` | `string` |  | Controlled or uncontrolled text. Uncontrolled input clears itself after a submit. |
| `onSubmit` | `(value: string) => void` |  | Called with the text on Enter or Send. Not called while empty, disabled or not `idle`. |
| `onStop` | `() => void` |  | Called by Stop, or Escape in the field, while `status="streaming"`. |
| `status` | `'idle' \| 'submitting' \| 'streaming'` | `'idle'` | `streaming` swaps Send for Stop; `submitting` holds Send until the request is accepted. |
| `maxRows` | `number` | `8` | Rows the field grows to before it scrolls. |
| `attachments` | `ReactNode` |  | Rendered above the text, e.g. removable Chips. |
| `actions` | `ReactNode` |  | Rendered bottom-start, e.g. an attach IconButton or a model picker. |
| `surface` | `'solid' \| 'glass'` | `'solid'` | Glass material for composers floating over content. |
| `label` | `string` | `messages.promptLabel ('Message')` | Accessible name of the text field. |
| `messages` | `Partial<PromptInputMessages>` |  | Local overrides for `promptLabel`, `sendMessage`, `stopGenerating`, `promptHint`. |
| `textareaClassName` | `string` |  | Class for the textarea; `className` goes to the outer container. |

## Example: Default

Enter sends, Shift+Enter adds a line. Send stays inert until there is text.

```tsx
<PromptInput placeholder="Ask anything" onSubmit={(text) => send(text)} />
```

## Example: Attachments and actions

```tsx
<PromptInput
  placeholder="Ask about these files"
  attachments={
    <>
      <Chip onRemove={() => remove('q3-report.pdf')}>q3-report.pdf</Chip>
      <Chip onRemove={() => remove('pricing.csv')}>pricing.csv</Chip>
    </>
  }
  actions={
    <>
      <IconButton size="sm" label="Attach files"><Paperclip /></IconButton>
      <IconButton size="sm" label="Search the web"><Globe /></IconButton>
    </>
  }
/>
```

## Example: Streaming

Send a message: the button turns into Stop for three seconds. Stop or Escape ends it early.

```tsx
const [status, setStatus] = React.useState<PromptInputStatus>('idle');
const timer = React.useRef<ReturnType<typeof setTimeout>>();

function send() {
  setStatus('streaming');
  timer.current = setTimeout(() => setStatus('idle'), 3000);
}

function stop() {
  clearTimeout(timer.current);
  setStatus('idle');
}

<PromptInput placeholder="Ask anything" status={status} onSubmit={send} onStop={stop} />
```

## Accessibility

- Roles: textbox (multiline), button (Send / Stop)
- `Enter`: Sends. Ignored while an IME composition is open.
- `Shift + Enter`: New line.
- `Escape`: Stops the reply while streaming.
- Focus stays in the field after sending, so the user can type the next message straight away.
- An empty field keeps Send focusable with `aria-disabled`, rather than removing it from the tab order.
- The field is named by `label` (default "Message") and described by the Enter/Shift+Enter hint.
- Send and Stop are icon buttons with their own names; the swap does not move focus.

Related: [message-bubble](message-bubble.md), [conversation](conversation.md), [textarea](textarea.md)
