'use client'; // docs preview: server pages import every example

import { BarChart } from '@nexub/react';

const data = [
  { quarter: 'Q1', web: 120, ios: 80, android: 60 },
  { quarter: 'Q2', web: 140, ios: 95, android: 72 },
  { quarter: 'Q3', web: 150, ios: 110, android: 90 },
  { quarter: 'Q4', web: 170, ios: 128, android: 101 },
];

export default function Example() {
  return (
    <BarChart
      stacked
      className="w-full"
      title="Signups by platform"
      data={data}
      index="quarter"
      series={[{ key: 'web', label: 'Web' }, { key: 'ios', label: 'iOS' }, { key: 'android', label: 'Android' }]}
    />
  );
}
