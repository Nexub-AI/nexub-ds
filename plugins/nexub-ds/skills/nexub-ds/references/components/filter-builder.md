# Filter Builder

Build AND/OR filter queries with nested groups. The output is plain JSON your app runs.

- Package: `@nexub/react` · Category: Form Controls · Status: beta
- Import: `import { FilterBuilder } from '@nexub/react';`
- Docs: https://nexub-ds-docs.pages.dev/components/filter-builder

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `fields` (required) | `{ id; label; type: "text" \| "number" \| "select" \| "date"; options? }[]` |  | What can be filtered. The type picks the operators and the value input. |
| `value / defaultValue` | `FilterGroup` |  | `{ id, combinator: "and" \| "or", rules: (FilterRule \| FilterGroup)[] }`; a rule is `{ id, field, operator, value: string }`. |
| `onValueChange` | `(value: FilterGroup) => void` |  | Called with the whole query on every change. |
| `maxDepth` | `number` | `1` | Levels of nested groups "Add group" may create; 0 hides it. |

## Example: Deals filter

```tsx
'use client';

import * as React from 'react';
import { FilterBuilder, type FilterField, type FilterGroup } from '@nexub/react';

const fields: FilterField[] = [
  { id: 'name', label: 'Deal name', type: 'text' },
  { id: 'amount', label: 'Amount', type: 'number' },
  {
    id: 'stage',
    label: 'Stage',
    type: 'select',
    options: [
      { value: 'lead', label: 'Lead' },
      { value: 'proposal', label: 'Proposal' },
      { value: 'won', label: 'Won' },
    ],
  },
  { id: 'close', label: 'Close date', type: 'date' },
];

export default function Example() {
  const [query, setQuery] = React.useState<FilterGroup>({
    id: 'root',
    combinator: 'and',
    rules: [
      { id: 'r1', field: 'stage', operator: 'equals', value: 'proposal' },
      { id: 'r2', field: 'amount', operator: 'greaterThan', value: '10000' },
    ],
  });
  return (
    <div className="flex w-full max-w-[640px] flex-col gap-4">
      <FilterBuilder fields={fields} value={query} onValueChange={setQuery} />
      <pre className="max-h-40 overflow-auto rounded-shape-container bg-[var(--color-surface-container-low)] p-3 text-label-sm">
        {JSON.stringify(query, null, 2)}
      </pre>
    </div>
  );
}
```

## Accessibility

- Roles: Each group is a `group` named "Filters, match all/any".
- Field, condition and value controls are labelled; remove buttons say what they remove.
- Helpers: `emptyFilter()`, `countFilters(group)`, `isFilterGroup(rule)`, `filterOperators`.

Related: [filter-bar](filter-bar.md), [saved-views](saved-views.md), [data-table](data-table.md)
