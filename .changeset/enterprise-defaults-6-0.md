---
"@nexub/react": minor
"@nexub/patterns": minor
---

6.0: enterprise defaults. Three opt-ins from 5.x are now on by default. No component is removed and no prop is renamed. See Migrating to 6.0, and run `npx nexub-migrate src --rules keep-5-defaults --write` to keep 5.x behaviour.

- **Autocomplete** opens its list in a popover anchored to the field (`mode` defaults to `'popover'`). Set `mode="inline"` for the 5.x inline list.
- **DataTable / DataTableVirtual** with `enableRowSelection` show the checkbox column, with select-page and "Select all N" (`selectionColumn` defaults to `true`). Set `selectionColumn={false}` if you render your own checkboxes.
- **FilterBar** names its search field from `searchPlaceholder` (without a trailing "…") when `searchLabel` isn't set, instead of the generic "Search".
