'use client'; // docs preview: server pages import every example

import { Funnel } from '@nexub/react';

export default function Example() {
  return (
    <Funnel
      className="w-full"
      title="Signup funnel by channel"
      show="conversion"
      series={[{ key: 'value', label: 'Web' }, { key: 'app', label: 'App', color: 3 }]}
      data={[
        { label: 'Visited', value: 12400, values: { app: 8200 } },
        { label: 'Started signup', value: 4100, values: { app: 3900 } },
        { label: 'First payment', value: 1240, values: { app: 1500 } },
      ]}
    />
  );
}
