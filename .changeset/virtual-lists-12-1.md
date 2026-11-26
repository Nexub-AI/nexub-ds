---
'@nexub/react': minor
---

12.1 Performance: long option lists render only the rows in view. `MultiSelect`, `CommandList` (so `CommandPalette` too) and `ComboboxField` / `ComboboxPicker` (so `CurrencySelect` too) window their options above 100 (`virtualizeAbove` sets the threshold). Nothing else changes for the user:

- Search uses cmdk's own ranking, and groups stay in the order cmdk gives them.
- Arrow keys, Home, End and Page Up/Down move over the whole list. CommandList still loops.
- Screen readers hear each option's place in the whole list (`aria-setsize`, `aria-posinset`) and the active option (`aria-activedescendant`).
- A group whose heading has scrolled out keeps its name for screen readers.
- Native lists are FlatLists already, so the native twins don't take the prop.
