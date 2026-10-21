import type { Meta } from '@storybook/react';
import * as React from 'react';
import { BentoGrid, BentoTile } from './BentoGrid.js';

const meta: Meta = { title: 'Patterns/BentoGrid' };
export default meta;

const IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#0e7490"/><stop offset="1" stop-color="#f59e0b"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/></svg>',
  );

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <BentoTile className="flex flex-col justify-between">
      <span className="text-label-md text-[var(--color-on-surface-variant)]">{label}</span>
      <span className="text-title-lg text-[var(--color-on-surface)]">{value}</span>
    </BentoTile>
  );
}

const bars = [40, 65, 50, 80, 72, 90, 60];
const barHeights = ['h-[40%]', 'h-[65%]', 'h-[50%]', 'h-[80%]', 'h-[72%]', 'h-[90%]', 'h-[60%]'];

function Dashboard() {
  return (
    <BentoGrid>
      <BentoTile size="2x2" className="flex flex-col gap-3">
        <h3 className="text-title-sm text-[var(--color-on-surface)]">Revenue, last 7 days</h3>
        {/* Chart placeholder */}
        <div role="img" aria-label={`Bar chart: ${bars.join(', ')}`} className="flex flex-1 items-end gap-2">
          {barHeights.map((h, i) => (
            <div key={i} className={`flex-1 rounded-shape-min bg-[var(--color-primary-container)] ${h}`} />
          ))}
        </div>
      </BentoTile>
      <Stat label="Active users" value="12,480" />
      <Stat label="Conversion" value="3.2%" />
      <BentoTile size="1x2" className="overflow-hidden p-0">
        <img src={IMG} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      </BentoTile>
      <Stat label="Churn" value="0.8%" />
      <BentoTile size="2x1" className="flex items-center text-body-md text-[var(--color-on-surface-variant)]">
        3 invoices awaiting approval.
      </BentoTile>
      <Stat label="NPS" value="61" />
    </BentoGrid>
  );
}

export const Wide = () => (
  <div className="w-[960px]">
    <Dashboard />
  </div>
);
export const Medium = () => (
  <div className="w-[600px]">
    <Dashboard />
  </div>
);
export const Narrow = () => (
  <div className="w-[360px]">
    <Dashboard />
  </div>
);
