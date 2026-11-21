'use client'; // docs preview: server pages import every example

import { StageCounter } from '@nexub/react';

export default function Example() {
  return (
    <StageCounter
      aria-label="Filter orders by stage"
      multiple
      defaultValue={['new', 'packing']}
      stages={[
        { value: 'new', label: 'New', count: 18 },
        { value: 'packing', label: 'Packing', count: 7 },
        { value: 'shipped', label: 'Shipped', count: 342, failed: 2 },
        { value: 'returned', label: 'Returned', count: 4, tone: 'danger' },
      ]}
    />
  );
}
