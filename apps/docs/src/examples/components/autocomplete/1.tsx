'use client'; // docs preview: server pages import every example

import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-65">
      <Autocomplete options={[]} loading placeholder="Type to see the loading state" />
    </div>
  );
}
