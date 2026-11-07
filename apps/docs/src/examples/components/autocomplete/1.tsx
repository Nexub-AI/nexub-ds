import { Autocomplete } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[260px]">
      <Autocomplete mode="inline" options={[]} loading placeholder="Loading options…" />
    </div>
  );
}
