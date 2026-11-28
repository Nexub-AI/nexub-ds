---
'@nexub/react-native': minor
---

**Native AI parts** (12.5): the 12.4 agent parts and streaming states on iOS and Android. Every new prop is optional; without them each component renders as before.

- New `ToolCall`: a tool call's name, status badge and run time (`duration`, shown as "1.2 s"), expandable to its input and output. `error` is shown in the failed state (a failed call with an error starts open), `onRetry` adds Retry, and `defaultOpen` / `open` + `onOpenChange` set the disclosure. Status changes are announced without moving focus.
- New `ApprovalCard`: Approve / Deny, plus an edit path (`args` shown as JSON and `onEdit(args)` for Edit, then "Approve with changes"), a pending state while a promise from `onApprove` / `onDeny` / `onEdit` runs (or while `pending` is set), and a controlled `outcome`. The outcome is announced and the screen reader moves to it.
- New `DiffView`: a unified diff with `lineNumbers` (old and new, counted from each `@@` header, not read aloud). Each line is read as "Added: …" or "Removed: …". Code always reads left to right, also in RTL.
- New `DiffReview`: a list of files, each a collapsible diff with Accept / Reject (`onAccept`, `onReject`, controlled `decisions` or `defaultDecisions`, `onDecisionsChange`) and a summary that is announced on each change ("1 accepted, 0 rejected, 2 to review").
- `DataList` `streaming`: rows can keep arriving. A skeleton row trails the last row (hidden from screen readers) and shows instead of `empty` before the first row. The list is busy, the row count is announced at most every 3 seconds, and "Done. N rows" is announced when `streaming` turns off. New rows fade in (instantly under Reduce Motion).
- `TextField` `streaming`: an agent is filling the field. It is busy for screen readers and shows a calm wash (none under Reduce Motion), and it stays editable. `generated`, with optional `onAcceptSuggestion` and `onClearSuggestion`, shows a "Suggested" mark beside the label that is read as part of the field's hint. Typing, accept or clear removes the mark.

This closes the 12.4 parity gaps for ToolCall, ApprovalCard, DiffView, DiffReview, DataTable `streaming` and FormField `streaming` / `generated`.
