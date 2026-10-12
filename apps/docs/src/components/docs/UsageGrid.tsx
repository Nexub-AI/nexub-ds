import * as React from 'react';
import { Check, X } from '@nexub/icons';
import type { UsageDef } from '@/registry/types';

interface Props {
  usage: UsageDef;
}

export function UsageGrid({ usage }: Props) {
  return (
    <div className="docs-usage-grid">
      <UsageCard tone="do" title="When to use" subtitle="Reach for this component when…" items={usage.whenToUse} />
      <UsageCard tone="dont" title="When not to use" subtitle="Pick a different component if…" items={usage.whenNotToUse} />
    </div>
  );
}

function UsageCard({
  tone,
  title,
  subtitle,
  items,
}: {
  tone: 'do' | 'dont';
  title: string;
  subtitle: string;
  items: string[];
}) {
  const Icon = tone === 'do' ? Check : X;
  return (
    <div className={`docs-usage-card docs-usage-${tone}`}>
      <div className="docs-usage-card-header">
        <span className="docs-usage-card-icon" aria-hidden="true">
          <Icon size={16} strokeWidth={3} />
        </span>
        <div>
          <p className="docs-usage-card-title">{title}</p>
          <p className="docs-usage-card-subtitle">{subtitle}</p>
        </div>
      </div>
      <ul className="docs-usage-list">
        {items.map((item) => (
          <li key={item} className="docs-usage-item">
            <span className="docs-usage-bullet" aria-hidden="true">
              <Icon size={11} strokeWidth={3.5} />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
