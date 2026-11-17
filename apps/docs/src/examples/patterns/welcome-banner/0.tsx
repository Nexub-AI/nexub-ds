'use client'; // docs preview: server pages import every example

import { WelcomeBanner } from '@nexub/patterns';
import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-full max-w-2xl">
      <WelcomeBanner
        title="Welcome back, Mei"
        description="Two bills are due this week."
        actions={<Button>Review bills</Button>}
      />
    </div>
  );
}
