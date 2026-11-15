'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { Chip } from '@nexub/react';

export default function Example() {
  const [chips, setChips] = React.useState(['Design', 'Engineering', 'Product']);
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {chips.map((c) => (
        <Chip key={c} onRemove={() => setChips((prev) => prev.filter((x) => x !== c))}>{c}</Chip>
      ))}
    </div>
  );
}
