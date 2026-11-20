'use client'; // docs preview: server pages import every example

import { ComparisonBar } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <ComparisonBar label="Goals" left={{ label: 'Team A', value: 3 }} right={{ label: 'Team B', value: 1 }} />
    </div>
  );
}
