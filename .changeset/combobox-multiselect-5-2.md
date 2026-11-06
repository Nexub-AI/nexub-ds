---
"@nexub/react": minor
"@nexub/core": minor
---

Combobox 2.0 and MultiSelect.

- **`MultiSelect`** (new, beta): pick several options, shown as chips in the field. Search filters the list. Extra chips collapse into "+N more" (`maxVisibleChips`, default 3). Backspace in an empty field removes the last chip. Options carry `aria-checked`, and each chip has a "Remove ‹label›" button. Also supports `onInputChange` for fetching as you type, `onCreate` and `loading`.
- **`Autocomplete`**: `mode="popover"` turns it into a field whose list opens below it while typing. `aria-expanded` follows the list. Inline stays the default until 6.0. New `onCreate` adds a "Create “text”" option, and `aria-label` and `disabled` are supported.
- **Loading** in Autocomplete and MultiSelect shows skeleton rows instead of text. "Loading" is still announced.
- **`Chip`**: new `removeLabel` prop for the dismiss button's accessible name.
- New messages: `createOption`, `removeOption`.
