'use client';

import { OrgChart, type OrgChartNode } from '@nexub/react';

const engineers = ['Ada', 'Alan', 'Grace', 'Linus', 'Margaret', 'Katherine', 'Emmy', 'Mary', 'Barbara', 'Dennis', 'Ken', 'Radia'];

const team: OrgChartNode[] = [
  {
    id: 'lead',
    label: 'Sophie Wilson',
    description: 'Head of Engineering',
    children: [
      {
        id: 'mgr',
        label: 'Tim Berners-Lee',
        description: 'Engineering manager',
        children: engineers.map((name, i) => ({ id: `e${i}`, label: name, description: i % 2 ? 'Engineer' : 'Senior engineer' })),
      },
      { id: 'design', label: 'Susan Kare', description: 'Design lead' },
      { id: 'qa', label: 'Edsger Dijkstra', description: 'QA lead' },
    ],
  },
];

export default function Example() {
  return (
    <OrgChart
      aria-label="Engineering"
      nodes={team}
      defaultExpanded={['lead', 'mgr']}
      stackAbove={4}
      zoomable
      className="h-[28rem] w-full"
    />
  );
}
