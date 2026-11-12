'use client'; // docs preview: server pages import every example

import { KpiTile } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-3">
      <KpiTile label="Monthly revenue" value="$68,420" change={0.114} trend={[42, 48, 45, 56, 61, 68]} />
      <KpiTile label="Customers" value="1,204" change={0.032} trend={[1080, 1100, 1150, 1170, 1190, 1204]} />
      <KpiTile label="Churn" value="2.1%" change={0.004} invert trend={[1.8, 1.9, 2.0, 1.9, 2.0, 2.1]} />
    </div>
  );
}
