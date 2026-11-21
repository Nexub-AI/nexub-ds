# FilterBar

Search + filter toolbar pattern for data-heavy list or table views.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { FilterBar } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/filter-bar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `search` | `boolean` | `true` | 11.3: `false` leaves the search field out, for a bar of filters and actions only. |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder text for the search input. |
| `searchValue` | `string` |  | Controlled search value. |
| `onSearch` | `(value: string) => void` |  | Callback when search value changes. |
| `searchLabel` | `string` | `'Search'` | Accessible name of the search field (5.1). Defaults to the localised `search` message. |
| `filters` | `React.ReactNode` |  | Filter controls rendered to the right of search. |
| `activeCount` | `number` | `0` | Applied filters; above 0 shows "N filters" (5.5). `countFilters(group)` counts a FilterBuilder query. |
| `onClearAll` | `() => void` |  | Shows a Clear all button next to the count (5.5). |
| `actions` | `React.ReactNode` |  | Action buttons (e.g. "Export") rendered on the far right. |

## Example: Default

```tsx
import { FilterBar } from '@nexub/patterns';
import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-120">
      <FilterBar
        searchPlaceholder="Search users…"
        filters={
          <div className="flex gap-2 flex-wrap items-center justify-center">
            <Badge tone="neutral">Status: All</Badge>
            <Badge tone="neutral">Plan: All</Badge>
          </div>
        }
      />
    </div>
  );
}
```

## Example: Without search

`search={false}`.

```tsx
import { FilterBar } from '@nexub/patterns';
import { Badge, Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-120">
      <FilterBar
        search={false}
        filters={<Badge tone="neutral">Status: Open</Badge>}
        actions={<Button variant="outlined" size="sm">Export</Button>}
      />
    </div>
  );
}
```
