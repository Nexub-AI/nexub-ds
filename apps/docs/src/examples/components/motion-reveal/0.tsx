import { Card, Reveal } from '@nexub/react';

export default function Example() {
  return (
    <div data-mode="marketing" className="flex h-64 w-full flex-col gap-6 overflow-y-auto p-2">
      <p className="m-0 shrink-0 pb-40 text-body-md text-[var(--color-on-surface-variant)]">Scroll down</p>
      {[1, 2, 3].map((n) => (
        <Reveal key={n} className="shrink-0">
          <Card variant="showcase" className="p-6">Section {n}</Card>
        </Reveal>
      ))}
    </div>
  );
}
