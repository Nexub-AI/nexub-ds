import { Button } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex gap-2 flex-wrap items-center justify-center">
      <Button variant="primary" loading>Loading</Button>
      <Button variant="outline" disabled>Disabled</Button>
    </div>
  );
}
