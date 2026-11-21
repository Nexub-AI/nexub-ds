'use client'; // docs preview: server pages import every example

import { Gauge } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      <Gauge title="Uptime" value={99} tone="good" caption="On target" />
      <Gauge title="Storage used" value={82} tone="warning" caption="41 of 50 GB" />
      <Gauge title="Budget spent" value={104} label="104%" tone="danger" caption="Over budget" />
    </div>
  );
}
