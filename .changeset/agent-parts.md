---
'@nexub/react': minor
'@nexub/core': minor
---

**Agent parts** (12.4) in AgentKit. Every new prop is optional; without them each part renders as before.

- `ToolCall`: `duration` (ms, shown as "1.2 s"), `error` (shown as text in the failed state, and a failed call with an error starts open), `onRetry` (a Retry button when failed), `defaultOpen` and `messages`. The status badge is a polite live region, so Running → Done is announced without moving focus. Without `onRetry` ToolCall is still a server component.
- `ApprovalCard`: an edit path (`args` shown as JSON, plus `onEdit(args)` adds Edit, then "Approve with changes"), a pending state while a promise from `onApprove` / `onDeny` / `onEdit` runs (or while `pending` is set), a controlled `outcome` (`'approved' | 'edited' | 'denied' | null`), and focus that moves to the card when the choice resolves. The card is now a group named by its title.
- `DiffView`: `lineNumbers` counts old and new lines from each `@@ -a,b +c,d @@` header (hidden from screen readers), and `messages` for the screen-reader prefixes.
- New `DiffReview` (beta): a list of files, each a collapsible DiffView with Accept / Reject toggles (`onAccept(file)`, `onReject(file)`, controlled `decisions` or `defaultDecisions`, `onDecisionsChange`) and a polite summary ("1 accepted, 0 rejected, 2 to review").
- `@nexub/core`: new English messages for these parts (`toolCallStatus`, `toolCallInput`, `toolCallOutput`, `toolCallError`, `toolCallDuration`, `approvalApprove`, `approvalDeny`, `approvalEdit`, `approvalApproveEdited`, `approvalArgs`, `approvalPending`, `approvalOutcome`, `diffAdded`, `diffRemoved`, `diffLineCounts`, `diffAccept`, `diffReject`, `diffAcceptFile`, `diffRejectFile`, `diffDecision`, `diffReviewSummary`). ToolCall and DiffView render on the server, so they read these defaults and their `messages` prop rather than NexubProvider; ApprovalCard and DiffReview follow NexubProvider.

**Parity gaps (planned for 12.5):** `@nexub/react-native` has no AgentKit parts yet, so ToolCall (`duration`, `error`, `onRetry`, `defaultOpen`), ApprovalCard (edit path, pending, `outcome`, focus after a choice), DiffView `lineNumbers` and DiffReview are web-only for now.
