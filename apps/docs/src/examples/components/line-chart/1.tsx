'use client'; // docs preview: server pages import every example

import { LineChart } from '@nexub/react';

const data = [
  { day: 'Mon', p95: 210 },
  { day: 'Tue', p95: 190 },
  { day: 'Wed', p95: 240 },
  { day: 'Thu', p95: 205 },
  { day: 'Fri', p95: 180 },
];

export default function Example() {
  return (
    <LineChart
      area
      size="sm"
      className="w-full"
      title="API latency, p95"
      data={data}
      index="day"
      series={[{ key: 'p95', label: 'p95 latency', color: 6 }]}
      valueFormat={(v) => `${v} ms`}
    />
  );
}
