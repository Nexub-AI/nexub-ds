'use client';

import * as React from 'react';
import { Badge, OrgChart, type OrgChartNode } from '@nexub/react';

const teams: OrgChartNode[] = [
  {
    id: 'studio',
    label: 'Studio',
    description: '24 people',
    children: [
      { id: 'design', label: 'Design', description: '8 people' },
      { id: 'build', label: 'Build', description: '12 people', children: [{ id: 'web', label: 'Web', description: '7 people' }, { id: 'apps', label: 'Apps', description: '5 people' }] },
      { id: 'ops', label: 'Ops', description: '4 people' },
    ],
  },
];

export default function Example() {
  const [expanded, setExpanded] = React.useState<string[]>(['studio']);
  return (
    <OrgChart
      aria-label="Teams"
      nodes={teams}
      expanded={expanded}
      onExpandedChange={setExpanded}
      renderCard={(team) => (
        <span className="flex flex-col items-center gap-1">
          <span className="text-title-sm">{team.label}</span>
          <Badge variant="soft">{team.description}</Badge>
        </span>
      )}
    />
  );
}
