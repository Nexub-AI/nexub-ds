'use client'; // docs preview: server pages import every example

import { IconPicker } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap gap-4">
      <IconPicker aria-label="Invalid" invalid />
      <IconPicker aria-label="Read-only" readOnly defaultValue="Star" />
      <IconPicker aria-label="Disabled" disabled defaultValue="Bell" />
    </div>
  );
}
