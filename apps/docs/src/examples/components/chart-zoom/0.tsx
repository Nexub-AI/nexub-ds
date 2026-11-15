'use client';

import { ChartZoom, LineChart } from '@nexub/react';

const data = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => ({
  month,
  revenue: 120 + i * 14 + (i % 3) * 9,
}));

export default function Example() {
  return (
    <ChartZoom data={data} index="month" defaultRange={[3, 8]} className="w-full">
      {(slice) => (
        <LineChart className="w-full" title="Revenue ($k)" data={slice} index="month" series={[{ key: 'revenue', label: 'Revenue' }]} />
      )}
    </ChartZoom>
  );
}
