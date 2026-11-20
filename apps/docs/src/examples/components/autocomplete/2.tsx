'use client'; // docs preview: server pages import every example

import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-65">
      <Autocomplete
        options={[
          { value: 'nexub', label: 'Nexub' },
          { value: 'acme', label: 'Acme Corp' },
        ]}
        placeholder="Search company…"
        emptyText="No companies found. Try a different search."
      />
    </div>
  );
}
