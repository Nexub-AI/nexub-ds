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
