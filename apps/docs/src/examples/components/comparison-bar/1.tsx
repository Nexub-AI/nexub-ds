'use client'; // docs preview: server pages import every example

import { ComparisonBar } from '@nexub/react';

const percent = (n: number) => `${n}%`;
const stats: [string, number, number, ((n: number) => string)?][] = [
  ['Possession', 58, 42, percent],
  ['Shots', 14, 9],
  ['Shots on target', 6, 6],
  ['Corners', 3, 7],
];

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      {stats.map(([label, a, b, format], i) => (
        <ComparisonBar
          key={label}
          label={label}
          left={{ label: 'Team A', value: a, color: 'blue' }}
          right={{ label: 'Team B', value: b, color: 'amber' }}
          valueFormat={format}
          showLabels={i === stats.length - 1}
        />
      ))}
    </div>
  );
}
