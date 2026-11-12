'use client'; // docs preview: server pages import every example

import { Card } from '@nexub/react';

const products = [
  { accent: 'payub', name: 'Payub', line: 'Payroll and HR' },
  { accent: 'bookub', name: 'Bookub', line: 'Bookkeeping' },
] as const;

export default function Example() {
  return (
    <div data-mode="marketing" className="grid w-full gap-6 sm:grid-cols-2">
      {products.map((p) => (
        <Card key={p.name} variant="showcase" accent={p.accent} className="flex flex-col gap-2 p-6">
          <h3 className="m-0 text-title-lg">{p.name}</h3>
          <p className="m-0 text-body-md text-[var(--color-on-surface-variant)]">{p.line}</p>
        </Card>
      ))}
    </div>
  );
}
