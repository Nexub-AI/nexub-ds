# Diff View

A unified diff with added and removed lines, for agent changes.

- Package: `@nexub/react` · Category: AI · Status: beta
- Import: `import { DiffView } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/diff-view

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `diff` (required) | `string` |  | Unified diff text. |
| `file` | `string` |  | File name above the diff. |

## Example: Proposed change

```tsx
import { DiffView } from '@nexub/react';

const diff = `@@ -3,4 +3,4 @@
 export const reminder = {
-  subject: 'Invoice overdue',
+  subject: 'A friendly reminder about your invoice',
   tone: 'polite',
 };`;

export default function Example() {
  return <DiffView className="w-full" file="templates/reminder.ts" diff={diff} />;
}
```

## Accessibility

- Added and removed lines are spelled out for screen readers; colour is not the only cue.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md)
