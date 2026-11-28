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
| `lineNumbers` | `boolean` |  | Old and new line numbers, counted from each `@@ -a,b +c,d @@` header (12.4). |
| `messages` | `Partial<{ diffAdded, diffRemoved }>` |  | Screen-reader prefixes. DiffView renders on the server, so translate here (12.4). |
| `DiffReview files` (required) | `{ file: string; diff: string }[]` |  | DiffReview (beta, 12.4): the files to review, each a collapsible DiffView. |
| `DiffReview decisions / defaultDecisions` | `Record<string, 'accepted' \| 'rejected'>` |  | Per-file decisions keyed by path, controlled or starting values. A file with no entry is still to review. |
| `DiffReview onAccept / onReject` | `(file) => void` |  | Called with the file when its Accept or Reject is pressed. |
| `DiffReview onDecisionsChange` | `(decisions) => void` |  | The whole record after each decision. |
| `DiffReview lineNumbers / defaultOpen` | `boolean` | `true` | Line numbers in each diff; files start expanded. |

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

## Example: DiffReview: review file by file

DiffReview (beta, 12.4) lists an agent’s changed files. Each file collapses, shows its added and removed line counts, and has its own Accept and Reject; the summary counts what is accepted, rejected and still to review.

```tsx
import * as React from 'react';
import { DiffReview, type DiffDecision } from '@nexub/react';

const files = [
  {
    file: 'templates/reminder.ts',
    diff: `@@ -3,4 +3,4 @@
 export const reminder = {
-  subject: 'Invoice overdue',
+  subject: 'A friendly reminder about your invoice',
   tone: 'polite',
 };`,
  },
  {
    file: 'jobs/schedule.ts',
    diff: `@@ -10,3 +10,4 @@
 export const schedule = {
-  cadence: 'daily',
+  cadence: 'weekly',
+  skipWeekends: true,
 };`,
  },
];

export default function Example() {
  const [decisions, setDecisions] = React.useState<Record<string, DiffDecision>>({});
  return <DiffReview className="w-full" files={files} decisions={decisions} onDecisionsChange={setDecisions} />;
}
```

## Accessibility

- `Enter / Space`: DiffReview: expands or collapses a file, or presses Accept / Reject.
- Added and removed lines are spelled out for screen readers; colour is not the only cue. Line numbers are hidden from screen readers.
- DiffReview: each file toggle reports aria-expanded and its line counts; Accept and Reject are toggle buttons named with the file ("Accept src/billing.ts") with aria-pressed; the summary is a polite status.

Related: [message-bubble](message-bubble.md), [thinking-indicator](thinking-indicator.md), [approval-card](approval-card.md), [tool-call](tool-call.md)
