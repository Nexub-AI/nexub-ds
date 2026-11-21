'use client'; // docs preview: server pages import every example

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
