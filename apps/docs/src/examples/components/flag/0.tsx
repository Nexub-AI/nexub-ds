'use client'; // docs preview: server pages import every example

import { Flag } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex items-center gap-3">
      <Flag code="JP" size="sm" aria-label="Japan" />
      <Flag code="IN" aria-label="India" />
      <Flag code="FR" size="lg" aria-label="France" />
    </div>
  );
}
