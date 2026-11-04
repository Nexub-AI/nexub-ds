import { Chip } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      {['Design', 'Engineering', 'Product'].map((c) => <Chip key={c}>{c}</Chip>)}
    </div>
  );
}
