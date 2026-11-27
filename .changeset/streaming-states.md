---
'@nexub/react': minor
'@nexub/core': minor
---

**Streaming table and form states** (12.4), for when an agent is producing the data. All props are optional; without them both components render exactly as before.

- `DataTable` `streaming`: rows can keep arriving. A skeleton row trails the last row (hidden from screen readers), the table is `aria-busy`, a polite live region announces the row count at most every 3 seconds (not once per row) and "Done. N rows" when `streaming` turns off. Rows that arrive meanwhile enter with the 12.3 `enter` motion preset (instant under reduced motion). Sorting and selection keep working. Before the first row, the skeleton row shows instead of the empty state.
- `FormField.Root` `streaming`: an agent is filling the field. The control gets `aria-busy` and a calm shimmer (none under reduced motion) and stays editable; pass the value as text arrives.
- `FormField.Root` `generated`, with optional `onAcceptSuggestion` and `onClearSuggestion`: a "Suggested" mark beside the label, read as part of the control's description (no live region), with accept and clear buttons when the handlers are set. Editing the value, accepting or clearing removes the mark; turning `generated` off and on shows it again.
- `@nexub/core`: new English messages `rowsSoFar`, `rowsDone`, `suggested`, `acceptSuggestion` and `clearSuggestion`.

**Parity gaps for 12.5:** `@nexub/react-native` doesn't have `DataTable` `streaming` or the `FormField` `streaming` / `generated` states yet. Both are web-only for now.
