'use client';

import { ChartToggle, LineChart } from '@nexub/react';

const data = [
  { m: 'May', web: 120, ios: 80, android: 60 },
  { m: 'Jun', web: 140, ios: 95, android: 72 },
  { m: 'Jul', web: 150, ios: 110, android: 90 },
  { m: 'Aug', web: 170, ios: 128, android: 101 },
];
const series = [{ key: 'web', label: 'Web' }, { key: 'ios', label: 'iOS' }, { key: 'android', label: 'Android' }];

export default function Example() {
  return (
    <ChartToggle series={series} className="w-full">
      {(visible) => <LineChart legend={false} title="Signups by platform" data={data} index="m" series={visible} />}
    </ChartToggle>
  );
}
