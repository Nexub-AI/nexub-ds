'use client'; // docs preview: server pages import every example

import * as React from 'react';
import { StageCounter } from '@nexub/react';

const stages = [
  { value: 'queued', label: 'Queued', count: 24 },
  { value: 'processing', label: 'Processing', count: 6, tone: 'info' as const },
  { value: 'review', label: 'In review', count: 3, tone: 'warning' as const },
  { value: 'done', label: 'Done', count: 1284, failed: 7 },
];

const jobs = [
  { id: 101, stage: 'queued' },
  { id: 102, stage: 'processing' },
  { id: 103, stage: 'review' },
  { id: 104, stage: 'done' },
  { id: 105, stage: 'queued' },
];

export default function Example() {
  const [stage, setStage] = React.useState<string | null>(null);
  const shown = stage ? jobs.filter((j) => j.stage === stage) : jobs;
  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      <StageCounter aria-label="Filter imports by stage" stages={stages} value={stage} onValueChange={setStage} />
      <ul className="m-0 flex flex-col gap-1 ps-4 text-body-md text-on-surface">
        {shown.map((j) => (
          <li key={j.id}>
            Import #{j.id} · {stages.find((s) => s.value === j.stage)?.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
