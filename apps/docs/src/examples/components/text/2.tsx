import { Text } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-1.5 items-start">
      <Text tone="default">Default</Text>
      <Text tone="secondary">Secondary</Text>
      <Text tone="muted">Muted</Text>
      <Text tone="subtle">Subtle</Text>
    </div>
  );
}
