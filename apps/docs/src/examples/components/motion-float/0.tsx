'use client'; // docs preview: server pages import every example

import { Card, Float } from '@nexub/react';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex gap-8 p-6">
      <Float>
        <Card variant="showcase" className="nx-mkt-float-card p-5">Payroll approved</Card>
      </Float>
      <Float speed="slow">
        <Card variant="showcase" className="nx-mkt-float-card p-5">Books closed</Card>
      </Float>
    </div>
  );
}
