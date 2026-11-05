# FilterBar

Search + filter toolbar pattern for data-heavy list or table views.

- Package: `@nexub/patterns` · Category: Data · Status: stable
- Import: `import { FilterBar } from '@nexub/patterns';`
- Docs: https://nexub-ds-docs.pages.dev/patterns/filter-bar

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `searchPlaceholder` | `string` | `'Search…'` | Placeholder text for the search input. |
| `searchValue` | `string` |  | Controlled search value. |
| `onSearch` | `(value: string) => void` |  | Callback when search value changes. |
| `filters` | `React.ReactNode` |  | Filter controls rendered to the right of search. |
| `actions` | `React.ReactNode` |  | Action buttons (e.g. "Export") rendered on the far right. |

## Example: Default

```tsx
import { FilterBar } from '@nexub/patterns';
import { Badge } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-[480px]">
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
