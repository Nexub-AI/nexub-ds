'use client';

import * as React from 'react';
import { OrgChart, type OrgChartNode } from '@nexub/react';

const people: OrgChartNode[] = [
  {
    id: 'ada',
    label: 'Ada Lovelace',
    description: 'Chief Executive',
    children: [
      {
        id: 'alan',
        label: 'Alan Turing',
        description: 'Engineering',
        children: [
          { id: 'grace', label: 'Grace Hopper', description: 'Platform lead' },
          { id: 'margaret', label: 'Margaret Hamilton', description: 'Flight software' },
        ],
      },
      { id: 'mary', label: 'Mary Somerville', description: 'Finance', children: [{ id: 'emmy', label: 'Emmy Noether', description: 'Analyst' }] },
      { id: 'katherine', label: 'Katherine Johnson', description: 'Research' },
    ],
  },
];

export default function Example() {
  const [opened, setOpened] = React.useState<string | null>(null);
  return (
    <div className="flex w-full flex-col gap-2">
      <OrgChart aria-label="Company" nodes={people} defaultExpanded={['ada', 'alan']} onActivate={(p) => setOpened(String(p.label))} />
      <p className="text-body-sm text-on-surface-muted">Opened: {opened ?? 'nobody yet'}</p>
    </div>
  );
}
