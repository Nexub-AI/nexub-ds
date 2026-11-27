# Prompt Input

The composer for a chat: an auto-growing text field with Send, which turns into Stop while a reply streams.

- Package: `@nexub/react` · Category: AI · Status: stable
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
| `messages` | `Partial<PromptInputMessages>` |  | Local overrides for `promptLabel`, `sendMessage`, `stopGenerating`, `promptHint`, `promptHintModEnter`, `promptSuggestions` and `promptCommands`. |
| `sendLabel` | `ReactNode` |  | 11.5: a visible text label on Send, beside the arrow. Without it, Send is an icon button. |
| `submitOn` | `'enter' \| 'mod-enter'` | `'enter'` | 11.5: `mod-enter` sends on Cmd/Ctrl+Enter, makes Enter add a line and shows that hint under the field. |
| `hint` | `ReactNode` |  | 11.5: helper text under the field, linked with `aria-describedby`. |
| `error` | `ReactNode` |  | 11.5: an error under the field. Marks the field invalid (`aria-invalid`) and links it. |
| `commands` | `CommandListItem[]` |  | 12.2: slash commands. Typing `/` opens them in a list above the field, filtered by what follows the slash (as CommandList: value, label, description and keywords). `shortcut` keys show at the end of a row. The list part loads on the first `/`. |
| `onCommand` | `(value: string, args: string) => void` |  | 12.2: called when a command is picked (Enter, Tab or click) with its `value` and the text after the command id: `/remind tomorrow 9am` → `("remind", "tomorrow 9am")`. Uncontrolled input then clears, as after a submit; controlled input leaves that to you. Enter on `/text` that matches no command submits as usual. |
| `chips` | `ReactNode` |  | 12.2: quick replies above the field, e.g. `Button size="sm" variant="tonal"` or Chips. One row that scrolls sideways with snap and edge fades when narrow, and wraps from 480px wide. Named by `messages.promptSuggestions` ("Suggestions"). |
| `textareaClassName` | `string` |  | Class for the textarea; `className` goes to the outer container. |

## Example: Default

Enter sends, Shift+Enter adds a line. Send stays inert until there is text.

```tsx
import { PromptInput } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-130">
      <PromptInput placeholder="Ask anything" />
    </div>
  );
}
```

## Example: Attachments and actions

```tsx
import * as React from 'react';
import { PromptInput, Chip, IconButton } from '@nexub/react';
import { Paperclip, Globe } from '@nexub/icons';

export default function Example() {
  const [files, setFiles] = React.useState(['q3-report.pdf', 'pricing.csv']);
  return (
    <div className="w-full max-w-130">
      <PromptInput
        placeholder="Ask about these files"
        attachments={
          files.length > 0 &&
          files.map((f) => (
            <Chip key={f} onRemove={() => setFiles((all) => all.filter((x) => x !== f))}>
              {f}
            </Chip>
          ))
        }
        actions={
          <>
            <IconButton size="sm" label="Attach files"><Paperclip /></IconButton>
            <IconButton size="sm" label="Search the web"><Globe /></IconButton>
          </>
        }
      />
    </div>
  );
}
```

## Example: Streaming

Send a message: the button turns into Stop for three seconds. Stop or Escape ends it early.

```tsx
import * as React from 'react';
import { type PromptInputStatus, PromptInput } from '@nexub/react';

export default function Example() {
  const [status, setStatus] = React.useState<PromptInputStatus>('idle');
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);
  const send = () => {
    setStatus('streaming');
    timer.current = setTimeout(() => setStatus('idle'), 3000);
  };
  const stop = () => {
    clearTimeout(timer.current);
    setStatus('idle');
  };
  return (
    <div className="w-full max-w-130">
      <PromptInput placeholder="Ask anything" status={status} onSubmit={send} onStop={stop} />
    </div>
  );
}
```

## Example: Label, hint and error

Cmd/Ctrl+Enter sends and Enter adds a line. Type more than 280 characters to see the error.

```tsx
import * as React from 'react';
import { PromptInput, toast } from '@nexub/react';

const LIMIT = 280;

export default function Example() {
  const [value, setValue] = React.useState('');
  const tooLong = value.length > LIMIT;
  return (
    <div className="w-full max-w-130">
      <PromptInput
        placeholder="Write a reply to the thread"
        value={value}
        onValueChange={setValue}
        onSubmit={() => {
          if (tooLong) return;
          toast.success('Reply sent');
          setValue('');
        }}
        submitOn="mod-enter"
        sendLabel="Reply"
        hint="Everyone in the thread can see your reply."
        error={tooLong ? `Shorten your reply to ${LIMIT} characters.` : undefined}
      />
    </div>
  );
}
```

## Example: Slash commands

Type `/` to open the commands above the field. ↑/↓ move, Enter or Tab picks, Esc closes and keeps the text. Type `/remind tomorrow 9am` and press Enter to pass the arguments. The field clears after a pick.

```tsx
import { PromptInput, toast, type CommandListItem } from '@nexub/react';

const commands: CommandListItem[] = [
  { value: 'remind', label: 'Remind me', description: 'e.g. /remind tomorrow 9am', shortcut: ['⌘', 'R'] },
  { value: 'summarize', label: 'Summarize', description: 'Summarize this thread', keywords: ['tldr'] },
  { value: 'translate', label: 'Translate', description: 'Translate the last reply' },
];

export default function Example() {
  return (
    <div className="w-full max-w-130 pt-48">
      <PromptInput
        placeholder="Type / for commands"
        commands={commands}
        onCommand={(value, args) => toast.info(args ? `/${value} with “${args}”` : `/${value}`)}
        onSubmit={(text) => toast.success(`Sent: ${text}`)}
      />
    </div>
  );
}
```

## Example: Quick replies

The `chips` row above the field. On a phone it scrolls sideways instead of wrapping.

```tsx
import * as React from 'react';
import { Button, PromptInput, toast } from '@nexub/react';

const replies = ['Approve', 'Reject', 'Ask for details', 'Remind me tomorrow'];

export default function Example() {
  const [value, setValue] = React.useState('');
  return (
    <div className="w-full max-w-130">
      <PromptInput
        placeholder="Reply"
        value={value}
        onValueChange={setValue}
        onSubmit={(text) => {
          toast.success(`Sent: ${text}`);
          setValue('');
        }}
        chips={replies.map((r) => (
          <Button key={r} size="sm" variant="tonal" onClick={() => setValue(r)}>
            {r}
          </Button>
        ))}
      />
    </div>
  );
}
```

## Accessibility

- Roles: textbox (multiline), button (Send / Stop), combobox + listbox (slash commands, while open), group (quick replies)
- `Enter`: Sends. Ignored while an IME composition is open.
- `Shift + Enter`: New line.
- `Cmd/Ctrl + Enter`: Sends with `submitOn="mod-enter"`, where Enter adds a line.
- `Escape`: Stops the reply while streaming. With the command list open, closes the list first and keeps the text.
- `/`: At the start of the text, opens the command list (with `commands`).
- `↑ / ↓`: Moves the active command, wrapping at the ends and skipping disabled ones.
- `Enter / Tab`: Picks the active command while the list is open (Shift+Tab still moves focus back).
- Focus stays in the field after sending, so the user can type the next message straight away.
- An empty field keeps Send focusable with `aria-disabled`, rather than removing it from the tab order.
- The field is named by `label` (default "Message") and described by the Enter/Shift+Enter hint.
- Send and Stop are icon buttons with their own names; the swap does not move focus.
- While the command list is open the field is a combobox (`aria-expanded`, `aria-controls`, `aria-autocomplete="list"`) and the active option is announced through `aria-activedescendant`; focus never leaves the field. Options are named "/id label" and described by their description. Closed, the field is the plain textbox again.
- The quick replies are a group named "Suggestions"; each reply is a button in the tab order before the field.

Related: [message-bubble](message-bubble.md), [conversation](conversation.md), [textarea](textarea.md)
