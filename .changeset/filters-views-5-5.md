---
"@nexub/react": minor
"@nexub/patterns": minor
"@nexub/core": minor
---

Filters and views.

- **`FilterBuilder`** (new, beta): builds AND/OR filter queries with nested groups (`maxDepth`, default 1). The output is plain JSON (`FilterGroup` / `FilterRule`), which your app runs. Field types `text`, `number`, `select` and `date` each get their own operators and value input. Helpers: `emptyFilter`, `countFilters`, `isFilterGroup`, `filterOperators`.
- **`SavedViews`** (new, beta): a menu to switch, save (asks for a name), update and delete views. UI only: your app stores them.
- **`DateRangePicker`**: `presets` (`true` gives Today, Last 7 days, Last 30 days, Month to date and Last month, or pass your own) and `timeZone`, shown under the calendar and used to count "today". `todayIn(zone)` is exported.
- **`FilterBar`** (patterns): `activeCount` shows "N filters", and `onClearAll` adds a Clear all button.
- Docs: removed DateRangePicker props that never existed (`numberOfMonths`, `error`).
- New messages for presets, the filter builder, saved views and the filter bar. `filterOperators` is one object: overriding it replaces all its labels.
