import { Button, EmptyStatePreset } from '@nexub/react';

export default function Example() {
  return (
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <EmptyStatePreset kind="noResults" actions={<Button variant="outline" size="sm">Clear filters</Button>} />
      <EmptyStatePreset kind="serverError" actions={<Button size="sm">Retry</Button>} />
    </div>
  );
}
