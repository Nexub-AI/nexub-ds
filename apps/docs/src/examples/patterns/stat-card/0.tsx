'use client'; // docs preview: server pages import every example

import { StatCard } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-[240px]">
      <StatCard label="Total Revenue" value="$48,295" delta="+12.5%" deltaType="increase" description="vs last month" />
    </div>
  );
}
