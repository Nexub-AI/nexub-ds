'use client'; // docs preview: server pages import every example

import { StatusSteps } from '@nexub/patterns';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <StatusSteps
        aria-label="Application progress"
        steps={[
          { id: 'submitted', title: 'Submitted', status: 'done', timestamp: <time dateTime="2026-03-12">12 Mar</time> },
          { id: 'review', title: 'Under review', status: 'current', description: 'Usually takes two working days.' },
          { id: 'approved', title: 'Approved', status: 'upcoming' },
        ]}
      />
    </div>
  );
}
