import { StatusPill } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <StatusPill tone="success" label="Active" />
      <StatusPill tone="warning" label="Pending" />
      <StatusPill tone="danger" label="Error" />
      <StatusPill tone="neutral" label="Draft" />
      <StatusPill tone="info" label="Syncing" />
    </div>
  );
}
