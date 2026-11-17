'use client'; // docs preview: server pages import every example

import { Select } from '@nexub/react';

const sizes = ['sm', 'md', 'lg'] as const;

export default function Example() {
  return (
    <div className="flex w-56 flex-col gap-3">
      {sizes.map((size) => (
        <Select.Root key={size}>
          <Select.Trigger size={size} aria-label={`Size ${size}`}><Select.Value placeholder={`Size ${size}`} /></Select.Trigger>
          <Select.Content>
            <Select.Item value="inr">INR</Select.Item>
            <Select.Item value="usd">USD</Select.Item>
          </Select.Content>
        </Select.Root>
      ))}
      <Select.Root defaultValue="inr">
        <Select.Trigger readOnly aria-label="Currency"><Select.Value /></Select.Trigger>
        <Select.Content>
          <Select.Item value="inr">INR (read-only)</Select.Item>
          <Select.Item value="usd">USD</Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  );
}
