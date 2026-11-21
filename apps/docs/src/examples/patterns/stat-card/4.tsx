'use client'; // docs preview: server pages import every example

import { StatCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
      <StatCard size="sm" label="Revenue" value="S$84,320" change={0.125} changeLabel="vs last month" />
      <StatCard size="sm" label="Cloud costs" value="S$12,400" change={0.08} tone="bad-when-high" changeLabel="vs last month" note="Includes a one-off migration" />
      <StatCard size="sm" label="Open tickets" value="42" change={-12} changeFormat="absolute" tone="bad-when-high" changeLabel="since Monday" />
    </div>
  );
}
