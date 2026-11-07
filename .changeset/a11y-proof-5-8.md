---
"@nexub/react": minor
---

Accessibility proof for the 5.x components.

- **`DataTable grid`**: an ARIA grid keyboard model for tables whose cells hold actions. The table becomes one tab stop; Arrow keys move between cells and the controls inside them, Home/End go to the row ends, and Ctrl+Home/End go to the corners. RTL mirrors Left and Right. Works with DataTableVirtual.
- **Calendar day names** (DatePicker, DateRangePicker): days are now named with Intl's full date ("Monday, November 2, 2026") instead of the ordinal "2nd", so the visible number is part of the name (WCAG 2.5.3, for voice control).
- **CommandPalette separators** no longer use `role="separator"` inside the listbox (ARIA allows only options and groups there).
- **axe on open popups**: CI now opens MultiSelect, Autocomplete, SavedViews, DateRangePicker, CommandPalette, AlertDialog Confirm and the DataTable View menu, then scans them. Popups render outside the story root, so they were never scanned before.
- **Screen-reader test scripts**: step-by-step VoiceOver and NVDA checks for 10 complex components, on the Accessibility conformance page.
