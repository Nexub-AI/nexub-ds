---
'@nexub/react': patch
---

Combobox and Autocomplete no longer scroll the page to their highlighted item when they mount. An inline list below the fold used to pull the window down to itself on load; the highlighted item now scrolls into view inside the list only.
