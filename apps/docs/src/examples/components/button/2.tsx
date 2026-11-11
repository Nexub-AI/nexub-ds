import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button size="xs" variant="filled">XSmall</Button>
      <Button size="sm" variant="filled">Small</Button>
      <Button size="md" variant="filled">Medium</Button>
      <Button size="lg" variant="filled">Large</Button>
    </div>
  );
}
