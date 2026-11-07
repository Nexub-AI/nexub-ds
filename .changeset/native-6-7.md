---
"@nexub/react-native": minor
"@nexub/core": minor
---

React Native parity for 6.x.

- **`TreeList`** (new): the web TreeView on mobile, as drill-down lists with a back row; leaves are picked like radio rows.
- **`StepProgress`** (new): the web Stepper on mobile: segments and "Step 2 of 4: Billing", read as a progress bar. (The existing `Stepper` stays the − value + control.)
- **`SortableList`** (new): the web Sortable on mobile: Move up / Move down buttons while `editing`, and the same moves as VoiceOver and TalkBack actions on every row.
- **`InlineEdit`** (new): text that turns into a field when tapped; Return or leaving the field saves.
- Docs: native twins for TimePicker and DateTimePicker (`DateTimeField` with `mode="time"`), TreeView, Sortable, Stepper and InlineEdit, with live mobile previews.
- New messages: `moveUp`, `moveDown`, `backTo`.
