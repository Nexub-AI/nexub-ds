'use client'; // docs preview: server pages import every example

import { Button } from '@nexub/react';
import { CTABand, SectionHeader } from '@nexub/marketing';

const divisions = [
  ['os', 'Nexub OS'],
  ['commerce', 'Nexub Commerce'],
  ['fintech', 'Nexub Fintech'],
  ['intelligence', 'Nexub Intelligence'],
  ['autonomous', 'Nexub Autonomous'],
] as const;

// Needs @nexub/themes/divisions. Each division page sets `division` on its sections.
export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      {divisions.map(([key, name]) => (
        <div key={key} className="pt-10">
          <SectionHeader division={key} eyebrow={name} title={`Start with ${name}`} level={3} />
          <CTABand
            division={key}
            title={`Try ${name} free for 30 days`}
            actions={<Button variant="filled" tone="neutral" size="lg">Create an account</Button>}
          />
        </div>
      ))}
    </div>
  );
}
