'use client'; // docs preview: server pages import every example

import { Button, Stepper } from '@nexub/react';

export default function Example() {
  return (
    <Stepper
      className="w-full"
      current={2}
      steps={[
        { label: 'Details', status: 'complete' },
        { label: 'Identity', status: 'skipped', description: 'Not needed for this plan' },
        { label: 'Bank check', status: 'error', description: 'The bank rejected the account', actions: <Button size="sm" variant="outlined">Retry</Button> },
        { label: 'Payout', status: 'upcoming' },
      ]}
    />
  );
}
