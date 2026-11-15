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

## Accessibility

- A native `<details>` disclosure: opens with Enter or Space.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md)
