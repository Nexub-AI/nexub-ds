---
"@nexub/react-native": minor
"@nexub/core": minor
"@nexub/react": minor
---

React Native parity for the 5.x data components.

- **`DataList`** (React Native): the mobile form of DataTable. One row per record with its key fields (no sideways grid), a Sort sheet (one sort plus direction), and a selection mode with a count and `bulkActions`. Built on FlatList.
- **`MultiSelect`** (React Native): a field that opens a sheet of checkbox rows, with search above 8 options. The field summarises the picks ("Bug, Design, +3 more").
- **`FileList`** (React Native): files picked for upload with size, progress, errors, and remove or cancel. Bring your own picker (for example, expo-document-picker).
- **`FilterSheet`** (React Native): the web FilterBuilder in a sheet. It edits one flat AND/OR list and keeps nested web groups untouched.
- **Shared filter model**: `FilterGroup`, `FilterRule`, `FilterField`, `filterOperators`, `countFilters`, `emptyFilter`, `newFilterRule` and `isFilterGroup` now live in `@nexub/core`. Both `@nexub/react` and `@nexub/react-native` re-export them, so saved queries move between platforms. No API change for web.
- New messages: `sortBy`, `sortDirection`, `ascending`, `descending`.
- Docs: web DataTable, MultiSelect, FilterBuilder and OTP Input pages now show their mobile twins with live previews.
