'use client'; // docs preview: server pages import every example

import { Button } from '@nexub/react';
import { CTABand } from '@nexub/marketing';

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <CTABand
        title="Start running your company on Nexub"
        description="Free for 30 days. No card needed."
        actions={<Button variant="filled" tone="neutral" size="lg">Create an account</Button>}
      />
    </div>
  );
}
