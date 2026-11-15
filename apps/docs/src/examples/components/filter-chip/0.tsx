'use client'; // docs preview: server pages import every example

import { FilterChip } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <FilterChip>All</FilterChip>
      <FilterChip selected>Active</FilterChip>
      <FilterChip>Archived</FilterChip>
      <FilterChip>Draft</FilterChip>
    </div>
  );
}
