'use client'; // docs preview: server pages import every example

import { StatusSteps } from '@nexub/patterns';
import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-sm">
      <StatusSteps
        aria-label="Application progress"
        steps={[
          { id: 'submitted', title: 'Submitted', status: 'done', timestamp: <time dateTime="2026-03-12">12 Mar</time> },
          {
            id: 'documents',
            title: 'Documents need another look',
            status: 'error',
            description: 'The proof of address is older than three months.',
            action: <Button size="sm" variant="tonal">Upload again</Button>,
          },
          { id: 'approved', title: 'Approved', status: 'upcoming' },
        ]}
      />
    </div>
  );
}
