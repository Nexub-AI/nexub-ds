'use client'; // docs preview: server pages import every example

import { LogoStrip } from '@nexub/marketing';

const customers = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Vandelay'];

export default function Example() {
  return (
    <div data-mode="marketing" className="w-full">
      <LogoStrip label="Trusted by 2,000+ teams">
        {customers.map((name) => (
          <span key={name} className="text-title-lg text-[var(--color-on-surface-muted)]">{name}</span>
        ))}
      </LogoStrip>
    </div>
  );
}
