'use client'; // docs preview: server pages import every example

import { ToggleGroup } from '@nexub/react';

export default function Example() {
  return (
    <ToggleGroup.Root type="multiple" defaultValue={['bold', 'italic']}>
      <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
