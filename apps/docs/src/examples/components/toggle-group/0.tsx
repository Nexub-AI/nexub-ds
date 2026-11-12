'use client'; // docs preview: server pages import every example

import { ToggleGroup } from '@nexub/react';

export default function Example() {
  return (
    <ToggleGroup.Root type="single" defaultValue="left">
      <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
      <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
      <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}
