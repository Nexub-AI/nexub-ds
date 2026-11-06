import { Card } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full grid-cols-2 gap-4">
      {['Revenue', 'Customers'].map((t) => (
        <Card key={t} variant="interactive" effect="tilt" className="p-6">
          <p className="m-0 text-label-md text-[var(--color-on-surface-variant)]">{t}</p>
          <p className="m-0 text-title-lg">{t === 'Revenue' ? '$68,420' : '1,204'}</p>
        </Card>
      ))}
    </div>
  );
}
