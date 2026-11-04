import { Amount } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-4">
      <Amount value={312.4} currency="USD" tone="auto" signDisplay="exceptZero" />
      <Amount value={-89.99} currency="USD" tone="auto" />
    </div>
  );
}
