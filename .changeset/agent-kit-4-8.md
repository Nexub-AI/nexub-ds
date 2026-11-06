---
"@nexub/react": minor
---

Agent UI kit.

- **`PlanTracker`**: an agent's plan as ordered steps (done, active, pending, failed), with each status read out and `aria-current="step"` on the active one.
- **`ToolCall`**: one tool call, its name and a status badge, expandable to its input and output. A native `<details>`, so it opens from the keyboard with no JavaScript.
- **`ApprovalCard`**: the agent asks before it acts. Approve or Deny, called back once, with the outcome announced.
- **`DiffView`**: a unified diff for proposed changes, with added and removed lines spelled out for screen readers.
- `PlanTracker`, `ToolCall` and `DiffView` are server components.
