# Tool Call

One tool call: its name and status, expandable to input and output.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { ToolCall } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/tool-call

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` (required) | `string` |  | Tool name. |
| `status` (required) | `'running' \| 'done' \| 'failed'` |  | Shown as a badge. |
| `input` | `unknown` |  | Arguments, shown as JSON. |
| `output` | `unknown` |  | Result, as text or JSON. |
| `duration` | `number` |  | Run time in milliseconds, shown formatted ("1.2 s") (12.4). |
| `error` | `ReactNode` |  | Why it failed, shown as text in the failed state; a failed call with an error starts open (12.4). |
| `onRetry` | `() => void` |  | A Retry button in the failed state. Without it ToolCall stays a server component (12.4). |
| `defaultOpen` | `boolean` |  | Open on first render; `open` still wins (12.4). |
| `messages` | `Partial<NexubMessages>` |  | Status words and headings. ToolCall renders on the server, so translate here (12.4). |

## Example: Tool call

```tsx
import { ToolCall } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-2">
      <ToolCall name="search_invoices" status="done" input={{ customer: 'Acme', status: 'unpaid' }} output={{ found: 3, total: '$4,120' }} open />
      <ToolCall name="draft_email" status="running" input={{ to: 'ap@acme.example', template: 'reminder' }} />
    </div>
  );
}
```

## Example: Run time, error and Retry

A finished call shows how long it took; a failed one opens on its error and offers Retry.

```tsx
import { ToolCall } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex w-full flex-col gap-2">
      <ToolCall name="draft_email" status="done" duration={1240} input={{ to: 'ap@acme.example' }} output="Draft saved" />
      <ToolCall name="send_email" status="failed" duration={30000} input={{ to: 'ap@acme.example' }} error="SMTP timeout after 30 s" onRetry={() => {}} />
    </div>
  );
}
```

## Accessibility

- A native `<details>` disclosure: opens with Enter or Space.
- The status badge is a polite live region, so Running → Done is announced without moving focus. The error is plain text, not an alert.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md)
