import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button size="xs" variant="primary">XSmall</Button>
      <Button size="sm" variant="primary">Small</Button>
      <Button size="md" variant="primary">Medium</Button>
      <Button size="lg" variant="primary">Large</Button>
    </div>
  );
}
