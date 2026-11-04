import { Spinner } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-5 flex-wrap items-center justify-center">
      <Spinner size="md" tone="info" />
      <Spinner size="md" tone="success" />
      <Spinner size="md" tone="warning" />
      <Spinner size="md" tone="danger" />
    </div>
  );
}
