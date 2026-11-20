'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { BarChart } from '@nexub/react';

type Row = { quarter: string; web: number; ios: number; android: number };

const data: Row[] = [
  { quarter: 'Q1', web: 120, ios: 80, android: 60 },
  { quarter: 'Q2', web: 140, ios: 95, android: 72 },
  { quarter: 'Q3', web: 150, ios: 110, android: 90 },
  { quarter: 'Q4', web: 170, ios: 128, android: 101 },
];

export default function Example() {
  const [picked, setPicked] = React.useState('Click a bar, or focus the chart and press Enter.');
  const pick = (point: { datum: Row; series?: { label?: string }; value?: number }) =>
    setPicked(`${point.datum.quarter}${point.series ? `, ${point.series.label}: ${point.value}` : ''}`);
  return (
    <div className="flex w-full flex-col gap-3">
      <BarChart
        interactive
        legend="toggle"
        onPointClick={pick}
        title="Signups by platform"
        data={data}
        index="quarter"
        series={[{ key: 'web', label: 'Web' }, { key: 'ios', label: 'iOS' }, { key: 'android', label: 'Android' }]}
      />
      <p className="m-0 text-body-sm text-on-surface-variant">{picked}</p>
    </div>
  );
}
