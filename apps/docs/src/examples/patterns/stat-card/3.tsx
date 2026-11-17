'use client'; // docs preview: server pages import every example

import { StatCard } from '@nexub/patterns';
import { Wallet } from '@nexub/icons';

export default function Example() {
  return (
    <div className="w-[260px]">
      <StatCard
        label="Saved"
        value="S$2,400"
        delta="12%"
        deltaType="increase"
        icon={<Wallet size={16} />}
        category="emerald"
        trend={[10, 12, 13, 15, 16, 19, 22]}
        trendLabel="Last 7 weeks, rising"
      />
    </div>
  );
}
