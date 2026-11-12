'use client'; // docs preview: server pages import every example

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
