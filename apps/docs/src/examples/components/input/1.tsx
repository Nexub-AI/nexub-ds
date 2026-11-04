import { Input } from '@nexub/react';

export default function Example() {
  return (
    <div className="flex flex-col gap-2 items-start w-[280px]">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  );
}
