import { Select } from '@nexub/react';

export default function Example() {
  return (
    <div className="w-[220px]">
      <Select.Root>
        <Select.Trigger><Select.Value placeholder="Select an option…" /></Select.Trigger>
        <Select.Content>
          <Select.Item value="option-1">Option 1</Select.Item>
          <Select.Item value="option-2">Option 2</Select.Item>
          <Select.Item value="option-3">Option 3</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
