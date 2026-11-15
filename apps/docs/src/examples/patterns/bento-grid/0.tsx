'use client'; // docs preview: server pages import every example

import { BentoGrid, BentoTile } from '@nexub/patterns';

function BentoStat({ label, value }: { label: string; value: string }) {
  return (
    <BentoTile className="flex flex-col justify-between">
      <span className="text-label-md text-[var(--color-on-surface-variant)]">{label}</span>
      <span className="text-title-lg text-[var(--color-on-surface)]">{value}</span>
    </BentoTile>
  );
}

export default function Example() {
  const bars = ['40%', '65%', '50%', '80%', '72%', '90%', '60%'];
  return (
    <BentoGrid className="w-full">
      <BentoTile size="2x2" className="flex flex-col gap-3">
        <h3 className="text-title-sm text-[var(--color-on-surface)]">Revenue, last 7 days</h3>
        <div role="img" aria-label={`Bar chart: ${bars.join(', ')}`} className="flex flex-1 items-end gap-2">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 rounded-shape-min bg-[var(--color-primary-container)]" style={{ height: h }} />
          ))}
        </div>
      </BentoTile>
      <BentoStat label="Active users" value="12,480" />
      <BentoStat label="Conversion" value="3.2%" />
      <BentoTile size="2x1" className="flex items-center text-body-md text-[var(--color-on-surface-variant)]">
        3 invoices awaiting approval.
      </BentoTile>
      <BentoStat label="Churn" value="0.8%" />
      <BentoStat label="NPS" value="61" />
    </BentoGrid>
  );
}
