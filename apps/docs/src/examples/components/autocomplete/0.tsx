'use client'; // docs preview: server pages import every example

import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[260px]">
      <Autocomplete
        options={[
          { value: 'react', label: 'React' },
          { value: 'vue', label: 'Vue' },
          { value: 'angular', label: 'Angular' },
          { value: 'svelte', label: 'Svelte' },
        ]}
        placeholder="Search framework…"
      />
    </div>
  );
}
